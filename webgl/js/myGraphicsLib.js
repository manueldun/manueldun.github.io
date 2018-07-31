
var statusLabel = document.getElementById('status');
var variableLabel = document.getElementById('variableLabel');
var canvas = document.getElementById('c');
canvas.width = 800;
canvas.style.width = 800;
canvas.height = 600;
canvas.style.height = 600;
var gl = canvas.getContext('webgl2');

function loadTextFile (path) {
  var xhr = new XMLHttpRequest();
  var text;
  xhr.addEventListener('load', function () {
    text = this.responseText;
  });
  xhr.open('GET', path, false);
  xhr.send();
  return text;
}
function loadGLTF (path) {
  var scene = JSON.parse(loadTextFile(path));

  var imagePath = (path.substring(0, path.lastIndexOf('/'))) + '/' + scene.images[0].name;
  if (scene.images[0].mimeType === 'image/jpeg') {
    imagePath += '.jpg';
  }

  var image = new Image();
  image.onLoad = function () {
    gl.createTexture();
  };
  image.src = imagePath;
  return scene;
}
class WASDcontrol {
  constructor () {
    this.forwardState = 'stopped';
    this.lateralState = 'stopped';
    this.position = glm.vec3(0.0, 0.0, -5.0);
    this.xAngle = 0.0;
    this.yAngle = 0.0;
    this.speed = 0.01;
  }
  get forwardDirection () {
    var rotationMatrix = glm.rotate(this.xAngle, glm.vec3(0.0, -1.0, 0.0))['*'](glm.rotate(this.yAngle, glm.vec3(-1.0, 0.0, 0.0)));
    var rotatedForwardDirection = rotationMatrix['*'](glm.vec4(0.0, 0.0, 1.0, 1.0)).xyz;
    return rotatedForwardDirection;
  }
  update (deltaTime) {
    variableLabel.innerHTML = this.position;
    switch (this.forwardState) {
      case 'forward':
        this.position = this.position['+'](this.forwardDirection['*'](this.speed * deltaTime));
        break;
      case 'backward':
        this.position = this.position['+'](this.forwardDirection['*'](-this.speed * deltaTime));
        break;
      default:
    }
    switch (this.lateralState) {
      case 'right':
        var rightDirection = glm.cross(this.forwardDirection, glm.vec3(0.0, 1.0, 0.0));
        this.position = this.position['+'](rightDirection['*'](this.speed * deltaTime));
        break;
      case 'left':
        rightDirection = glm.cross(this.forwardDirection, glm.vec3(0.0, 1.0, 0.0));
        this.position = this.position['+'](rightDirection['*'](-this.speed * deltaTime));
        break;
      default:
    }
  }
}

class GPUMesh {
  compileShader (vertexShaderPath, fragmentShaderPath) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    var vertexShaderSource = loadTextFile(vertexShaderPath);

    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);

    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(vertexShader));
      gl.deleteShader(vertexShader);
      return;
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    var fragmentShaderSource = loadTextFile(fragmentShaderPath);
    gl.shaderSource(fragmentShader, fragmentShaderSource);

    gl.compileShader(fragmentShader);

    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      console.log(gl.getShaderInfoLog(fragmentShader));
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      return;
    }

    this.glslProgram = gl.createProgram();
    gl.attachShader(this.glslProgram, vertexShader);
    gl.attachShader(this.glslProgram, fragmentShader);

    gl.linkProgram(this.glslProgram);

    if (!gl.getProgramParameter(this.glslProgram, gl.LINK_STATUS)) {
      console.log(gl.getProgramInfoLog(this.glslProgram));
      gl.deleteShader(vertexShader);
      gl.deleteShader(fragmentShader);
      gl.deleteProgram(this.glslProgram);
      return;
    }

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);
  }
  constructor (
    mesh = {
      vertexPosition: [
        -1.0, -1.0, 0.0,
        1.0, -1.0, 0.0,
        0.0, 1.0, 0.0],
      vertexIndices: [0, 1, 2]},

    vertexShaderPath = 'js/shaders/triangle/triangle.vsh',
    fragmentShaderPath = 'js/shaders/triangle/triangle.fsh') {
    this.elements = mesh.vertexIndices.length;
    this.vao = gl.createVertexArray();
    gl.bindVertexArray(this.vao);

    this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexPosition), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0);

    gl.enableVertexAttribArray(0);// position attribute

    if (mesh.vertexNormals !== undefined) {
      this.normalBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertexNormals), gl.STATIC_DRAW);
      gl.vertexAttribPointer(1, 3, gl.FLOAT, gl.FALSE, 0, 0);
      gl.enableVertexAttribArray(1);
    }

    if (mesh.uvCoordinates !== undefined) {
      this.uvBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.uvCoordinates), gl.STATIC_DRAW);
      gl.vertexAttribPointer(2, 2, gl.FLOAT, gl.FALSE, 0, 0);
      gl.enableVertexAttribArray(2);
    }

    this.elementBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.vertexIndices), gl.STATIC_DRAW);

    gl.bindVertexArray(null);

    this.wasdControl = new WASDcontrol();
    this.compileShader(vertexShaderPath, fragmentShaderPath);

    this.modelMatrixUniform = gl.getUniformLocation(this.glslProgram, 'modelMatrix');
    this.viewMatrixUniform = gl.getUniformLocation(this.glslProgram, 'viewMatrix');
    this.projectionMatrixUniform = gl.getUniformLocation(this.glslProgram, 'projectionMatrix');
    this.cameraPositionUniform = gl.getUniformLocation(this.glslProgram, 'cameraPosition');

    this.diffuseConstantUniform = gl.getUniformLocation(this.glslProgram, 'diffuseConstant');
    this.specularConstantUniform = gl.getUniformLocation(this.glslProgram, 'specularConstant');
    this.ambientConstantUniform = gl.getUniformLocation(this.glslProgram, 'ambientConstant');
    this.shininessConstantUniform = gl.getUniformLocation(this.glslProgram, 'shininessConstant');

    this.modelMatrix = glm.mat4(1.0);
    this.projectionMatrix = glm.perspective(glm.radians(45.0), 800.0 / 600.0, 0.1, 100.0);
    this.shininessConstant = 0.1;
  }

  render () {
    gl.useProgram(this.glslProgram);

    gl.uniformMatrix4fv(this.modelMatrixUniform, gl.FALSE, this.modelMatrix.elements);
    gl.uniformMatrix4fv(this.viewMatrixUniform, gl.FALSE, this.viewMatrix.elements);
    gl.uniformMatrix4fv(this.projectionMatrixUniform, gl.FALSE, this.projectionMatrix.elements);
    gl.uniform3fv(this.cameraPositionUniform, this.wasdControl.position.elements);

    gl.uniform3fv(this.diffuseConstantUniform, glm.vec3(0.9, 0.9, 0.9).elements);
    gl.uniform3fv(this.specularConstantUniform, glm.vec3(0.9, 0.9, 0.9).elements);
    gl.uniform3fv(this.ambientConstantUniform, glm.vec3(0.1, 0.1, 0.1).elements);
    gl.uniform1fv(this.shininessConstantUniform, new Float32Array([this.shininessConstant]));

    gl.enableVertexAttribArray(0);// position attribute

    gl.bindVertexArray(this.vao);
    gl.drawElements(gl.TRIANGLES, this.elements, gl.UNSIGNED_SHORT, 0);
  }
  delete () {
    gl.deleteProgram(this.glslProgram);
    OBJ.deleteMeshBuffers(gl, this.mesh);
  }

  get viewMatrix () {
    var rotationMatrix = glm.rotate(this.wasdControl.xAngle, glm.vec3(0.0, 1.0, 0.0))['*'](glm.rotate(this.wasdControl.yAngle, glm.vec3(1.0, 0.0, 0.0)));

    var translationMatrix = glm.translate(this.wasdControl.position);
    return rotationMatrix['*'](translationMatrix);
  }
  update (deltaTime) {
    this.wasdControl.update(deltaTime);
  }
}

gl.enable(gl.DEPTH_TEST);
var gpuMesh;
if (!gl) {
  console.log('error getting webgl2 context');
}
function update (deltaTime) {
  gpuMesh.update(deltaTime);
}

statusLabel.innerHTML = 'Descargando escena...';

OBJ.downloadMeshes(
  {sphere: 'Assets/sphere/sphere.obj',
    sponza: 'Assets/DabrovicSponza/sponza.obj',
    woodenBox: 'Assets/woodenBox/woodenBox.obj'},
  function (meshes) {
    var woodenBox = loadGLTF('Assets/woodenBox/woodenBox.gltf');
    console.log(woodenBox);
    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    var sphere = {vertexPosition: meshes.sphere.vertices,
      vertexNormals: meshes.sphere.vertexNormals,
      vertexIndices: meshes.sphere.indices
    };
    var woodenBox = {vertexPosition: meshes.woodenBox.vertices,
      vertexNormals: meshes.woodenBox.vertexNormals,
      vertexIndices: meshes.woodenBox.indices,
      uvCoordinates: meshes.woodenBox.textures
    };

    gpuMesh = new GPUMesh(sphere, 'js/shaders/sphere/sphere.vsh', 'js/shaders/sphere/sphere.fsh');

    var startTime = null;
    var deltaTime = null;
    var lastTime = 0;
    statusLabel.innerHTML = 'Corriendo...';

    function loop (timestamp) {
      if (!startTime) startTime = timestamp;
      deltaTime = timestamp - lastTime;
      lastTime = timestamp;
      update(deltaTime);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gpuMesh.render();
      window.requestAnimationFrame(loop);
    }
    window.requestAnimationFrame(loop);
  });

window.onbeforeunload = function () {
  gpuMesh.delete();

  return null;
};

document.addEventListener('keydown', (event) => {
  const keyName = event.key;
  switch (event.code) {
    case 'KeyW':
      gpuMesh.wasdControl.forwardState = 'forward';
      break;
    case 'KeyS':
      gpuMesh.wasdControl.forwardState = 'backward';
      break;
    case 'KeyD':
      gpuMesh.wasdControl.lateralState = 'right';
      break;
    case 'KeyA':
      gpuMesh.wasdControl.lateralState = 'left';
      break;
  }
});
document.addEventListener('keyup', (event) => {
  const keyName = event.key;
  switch (event.code) {
    case 'KeyW':
    case 'KeyS':
      gpuMesh.wasdControl.forwardState = 'stopped';
      break;
    case 'KeyD':
    case 'KeyA':
      gpuMesh.wasdControl.lateralState = 'stopped';
    default:
  }
});
canvas.addEventListener('mousemove', (event) => {
  if (event.buttons !== 0) {
    gpuMesh.wasdControl.xAngle += event.movementX * 0.005;
    gpuMesh.wasdControl.yAngle += event.movementY * 0.005;
  }
});
var MyGUI = function () {
  this.Shinness = 0.1;
  this.Light_Intensity = 1.0;
};
window.onload = function () {
  var text = new MyGUI();
  var gui = new dat.GUI();
  var shininessController = gui.add(text, 'Shinness', 0, 100);
  var Light_intensityController = gui.add(text, 'Light_Intensity', 0, 10);
  shininessController.onChange(function (value) {
    gpuMesh.shininessConstant = new Float32Array([value]);
  });
};
