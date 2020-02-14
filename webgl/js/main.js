
var gl;


main();
function main() {
  var canvas = document.getElementById('c');

  canvas.width = 800;
  canvas.style.width = 800;
  canvas.height = 600;
  canvas.style.height = 600;
  gl = canvas.getContext('webgl2');

  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.enable(gl.DEPTH_TEST);


  const sponzaModel = loadJSONmodel(gl, 'Assets/Sponza/sponzatri.json');

  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, 'shaders/forwardShading/forwardShading.fs');
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, 'shaders/forwardShading/forwardShading.vs');

  var program = createProgram(gl, vertexShader, fragmentShader);

  var samplerUniform = gl.getUniformLocation(program, 'diffuseTexture');
  var modelMatrixUniform = gl.getUniformLocation(program, 'modelMatrix');
  var modelMatrix = glMatrix.mat4.create();

  var viewMatrixUniform = gl.getUniformLocation(program, 'viewMatrix');

  var viewMatrix = Camera.getViewMatrix();

  var projectionMatrixUniform = gl.getUniformLocation(program, 'projectionMatrix');
  var projectionMatrix = glMatrix.mat4.create();


  //glMatrix.mat4.ortho(projectionMatrix, 50.0, -50.0, 50.0, -50.0, 50.0, -50.0);


  glMatrix.mat4.perspective(projectionMatrix, 35 * (180 / Math.PI), 800 / 600, 0.1, 1000);

  var cameraPositionUniform = gl.getUniformLocation(program, 'cameraPosition');

  gl.useProgram(program);
  gl.uniform3fv(cameraPositionUniform, Camera.position);
  gl.uniformMatrix4fv(modelMatrixUniform, false, modelMatrix);
  gl.uniformMatrix4fv(viewMatrixUniform, false, viewMatrix);
  gl.uniformMatrix4fv(projectionMatrixUniform, false, projectionMatrix);

  var inputLogic = initInputLogic(Camera);

  window.requestAnimationFrame(draw);
  class UniformObject {
    constructor(uniform, data, setUniform) {
      this.uniform = uniform;
      this.data = data;
      this.setUniform = setUniform;
    }
  }
  var uniforms = [new UniformObject(samplerUniform, 0, function () {
    gl.uniform1i(this.uniform, this.data);
  })];

  uniforms.push(new UniformObject(cameraPositionUniform, Camera.position, function () {
    gl.uniform3fv(this.uniform, this.data);
  }));
  var cameraPositiontoUpdate = uniforms[1].data;

  uniforms.push(new UniformObject(modelMatrixUniform, modelMatrix, function () {
    gl.uniformMatrix4fv(this.uniform, false, this.data);
  }));

  uniforms.push(new UniformObject(viewMatrixUniform, Camera.getViewMatrix(), function () {
    gl.uniformMatrix4fv(this.uniform, false, this.data);
  }));
  var viewMatrixtoUpdate = uniforms[3].data;

  uniforms.push(new UniformObject(projectionMatrixUniform, projectionMatrix, function () {
    gl.uniformMatrix4fv(this.uniform, false, this.data);
  }));

  var now = null;
  var delta = null;
  var last = null;


  function draw() {
    if (now === null) {
      now = Date.now();
    }
    if (last === null) {
      last = Date.now();
    }

    delta = now - last;
    last = Date.now();
    now = null;

    inputLogic(delta);


    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);



    uniforms[1].data = Camera.position;
    uniforms[3].data = Camera.getViewMatrix();

    sponzaModel.draw(gl, program, uniforms);
    window.requestAnimationFrame(draw);
  }
}

