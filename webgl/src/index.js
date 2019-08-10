import glm from 'glm-js';
// import gui from 'dat.GUI';
var gl;
main();
function main () {
  // var statusLabel = document.getElementById('status');
  // var variableLabel = document.getElementById('variableLabel');
  var canvas = document.getElementById('c');

  canvas.addEventListener('mousedown', mouseButtonDown);
  var clickedbutton = false;
  function mouseButtonDown (e) {
    if (typeof e === 'object') {
      switch (e.button) {
        case 0:
          clickedbutton = true;
          break;
        default:
      }
    }
  }

  canvas.addEventListener('mouseup', mouseButtonUp);
  function mouseButtonUp (e) {
    if (typeof e === 'object') {
      switch (e.button) {
        case 0:
          clickedbutton = false;
          break;
        default:
      }
    }
  }

  canvas.width = 800;
  canvas.style.width = 800;
  canvas.height = 600;
  canvas.style.height = 600;
  gl = canvas.getContext('webgl2');
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, 'js/shaders/woodenBox/woodenBox.fsh');
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, 'js/shaders/woodenBox/woodenBox.vsh');

  var program = createProgram(gl, vertexShader, fragmentShader);

  var vao = gl.createVertexArray();
  gl.bindVertexArray(vao);
  var positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  var position = [
    -1.0, -1.0, 0.0,
    -1.0, 1.0, 0.0,
    1.0, -1.0, 0.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(position), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0);

  var uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  var uv = [
    0.0, 0.0,
    1.0, 0.0,
    0.0, 1.0
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(uv), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(1);
  gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE, 0, 0);

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  const level = 0;
  const internalFormat = gl.RGBA;
  const width = 1;
  const height = 1;
  const border = 0;
  const srcFormat = gl.RGBA;
  const srcType = gl.UNSIGNED_BYTE;
  const pixel = new Uint8Array([0, 0, 255, 255]);
  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);

  const image = new Image();
  image.onload = function () {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  };
  image.src = 'Assets/woodenBox/woodenBox.jpg';
  var samplerUniform = gl.getUniformLocation(program, 'woodenTexture');

  var modelMatrixUniform = gl.getUniformLocation(program, 'modelMatrix');
  var modelMatrix = glm.mat4(1.0);

  var viewMatrixUniform = gl.getUniformLocation(program, 'viewMatrix');
  var cameraPosition = glm.vec3(0.0, 0.0, -10.0);
  var viewMatrix = glm.translate(glm.mat4(1.0), cameraPosition);

  var projectionMatrixUniform = gl.getUniformLocation(program, 'projectionMatrix');

  var projectionMatrix = glm.perspective(glm.radians(35.0), 800.0 / 600.0, 0.1, 1000.0);

  var cameraPositionUniform = glm.getUniformLocation(program, 'cameraPosition');

  console.log(cameraPositionUniform);

  gl.uniform3fv(cameraPositionUniform, cameraPosition);
  gl.uniformMatrix4fv(modelMatrixUniform, true, modelMatrix.elements);
  gl.uniformMatrix4fv(viewMatrixUniform, true, viewMatrix.elements);
  gl.uniformMatrix4fv(projectionMatrixUniform, true, projectionMatrix.elements);

  var keyW = false;
  var keyS = false;
  var keyA = false;
  var keyD = false;

  window.addEventListener('keydown',
    function moveForward (e) {
      switch (e.code) {
        case 'KeyW':
          keyW = true;
          break;
        case 'KeyS':
          keyS = true;
          break;
        case 'KeyA':
          keyA = true;
          break;
        case 'KeyD':
          keyD = true;
          break;
        default:
      }
    }
  );
  window.addEventListener('keyup',
    function moveForward (e) {
      switch (e.code) {
        case 'KeyW':
          keyW = false;
          break;
        case 'KeyS':
          keyS = false;
          break;
        case 'KeyA':
          keyA = false;
          break;
        case 'KeyD':
          keyD = false;
          break;
        default:
      }
    }
  );

  window.requestAnimationFrame(draw);

  var now = null;
  var delta = null;
  var last = null;

  function draw () {
    if (now === null) {
      now = Date.now();
    }
    if (last === null) {
      last = Date.now();
    }
    delta = now - last;
    last = Date.now();
    now = null;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    gl.bindVertexArray(vao);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    gl.uniform1i(samplerUniform, 0);

    if (keyW === true) {
      cameraPosition = cameraPosition['+'](glm.vec3(0.0, 0.0, delta * 0.01));
      viewMatrix = glm.translate(glm.mat4(1.0), cameraPosition);
    }
    if (keyS === true) {
      cameraPosition = cameraPosition['-'](glm.vec3(0.0, 0.0, delta * 0.01));
      viewMatrix = glm.translate(glm.mat4(1.0), cameraPosition);
    }
    if (keyD === true) {
      cameraPosition = cameraPosition['+'](glm.vec3(delta * 0.01, 0.0, 0.0));
      console.log(cameraPosition);
      viewMatrix = glm.translate(glm.mat4(1.0), cameraPosition);
    }
    if (keyA === true) {
      cameraPosition = cameraPosition['-'](glm.vec3(delta * 0.01, 0.0, 0.0));
      console.log(cameraPosition);
      viewMatrix = glm.translate(glm.mat4(1.0), cameraPosition);
    }

    gl.uniform3fv(cameraPositionUniform, cameraPosition.elements);
    gl.uniformMatrix4fv(modelMatrixUniform, true, modelMatrix.elements);
    gl.uniformMatrix4fv(viewMatrixUniform, true, viewMatrix.elements);
    gl.uniformMatrix4fv(projectionMatrixUniform, true, projectionMatrix.elements);

    gl.drawArrays(gl.TRIANGLES, 0, 3);
    window.requestAnimationFrame(draw);
  }
}

function getString (path, onReady) {
  var client = new XMLHttpRequest();
  client.open('GET', path, false);
  client.addEventListener('load', onReady);
  client.send();
  return client.responseText;
}
function createShader (gl, type, path) {
  var source;
  if (type === gl.VERTEX_SHADER) {
    source = getString('js/shaders/woodenBox/woodenBox.vsh');
  }
  if (type === gl.FRAGMENT_SHADER) {
    source = getString('js/shaders/woodenBox/woodenBox.fsh');
  }

  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));
  gl.deleteShader(shader);
}
function createProgram (gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));
  gl.deleteProgram(program);
}
