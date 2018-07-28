
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
    gl.shaderSource(fragmentShader, loadTextFile(fragmentShaderPath));
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
  constructor (vertexShaderPath = 'js/shaders/triangle/triangle.vsh',
    fragmentShaderPath = 'js/shaders/triangle/triangle.fsh',
    mesh) {
    var triangleVertexPosition = [
      -0.5, -0.5, 0.0,
      0.5, -0.5, 0.0,
      0.0, 0.5, 0.0
    ];
    this.positionBuffer = gl.createBuffer();
    console.log(this.positionBuffer);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangleVertexPosition), gl.STATIC_DRAW);

    var triangleVertexElement = [0, 1, 2];
    this.elementBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
    // console.log(this.elementBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(triangleVertexElement), gl.STATIC_DRAW);

    this.wasdControl = new WASDcontrol();
    this.compileShader(vertexShaderPath, fragmentShaderPath);

    gl.enableVertexAttribArray(0);// position attribute

    this.modelMatrixUniform = gl.getUniformLocation(this.glslProgram, 'modelMatrix');
    this.viewMatrixUniform = gl.getUniformLocation(this.glslProgram, 'viewMatrix');
    this.projectionMatrixUniform = gl.getUniformLocation(this.glslProgram, 'projectionMatrix');
    this.cameraPositionUniform = gl.getUniformLocation(this.glslProgram, 'cameraPosition');

    this.modelMatrix = glm.mat4(1.0);
    this.projectionMatrix = glm.perspective(glm.radians(45.0), 800.0 / 600.0, 0.1, 100.0);
  }

  render () {
    gl.useProgram(this.glslProgram);

    gl.uniformMatrix4fv(this.modelMatrixUniform, gl.FALSE, this.modelMatrix.elements);
    gl.uniformMatrix4fv(this.viewMatrixUniform, gl.FALSE, this.viewMatrix.elements);
    gl.uniformMatrix4fv(this.projectionMatrixUniform, gl.FALSE, this.projectionMatrix.elements);

    gl.uniform3fv(this.cameraPositionUniform, this.wasdControl.position.elements);

    gl.enableVertexAttribArray(0);// position attribute

    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.vertexAttribPointer(0, 1, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.elementBuffer);
    gl.drawElements(gl.TRIANGLES, 1, gl.UNSIGNED_SHORT, 0);
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
OBJ.downloadMeshes({'sphere': 'Assets/sphere/sphere.obj', 'sponza': 'Assets/DabrovicSponza/sponza.obj'}, function (meshes) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  OBJ.initMeshBuffers(gl, meshes.sponza);
  OBJ.initMeshBuffers(gl, meshes.sphere);

  gpuMesh = new GPUMesh();

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
  this.Shinness = 0.8;
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
