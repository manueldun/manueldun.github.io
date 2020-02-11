
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
  var modelMatrix = glm.mat4(1.0);
  var viewMatrixUniform = gl.getUniformLocation(program, 'viewMatrix');
  var viewMatrix = glm.translate(glm.mat4(1.0), Camera.position);
  var projectionMatrixUniform = gl.getUniformLocation(program, 'projectionMatrix');
  var projectionMatrix = glm.perspective(glm.radians(50.0), 800.0 / 600.0, 0.1, 1000.0);
  var cameraPositionUniform = gl.getUniformLocation(program, 'cameraPosition');

  gl.useProgram(program);
  gl.uniform3fv(cameraPositionUniform, Camera.position.elements);
  gl.uniformMatrix4fv(modelMatrixUniform, true, modelMatrix.elements);
  gl.uniformMatrix4fv(viewMatrixUniform, true, viewMatrix.elements);
  gl.uniformMatrix4fv(projectionMatrixUniform, true, projectionMatrix.elements);

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

  uniforms.push(new UniformObject(cameraPositionUniform, Camera.position.elements, function () {
    gl.uniform3fv(this.uniform, this.data);
  }));
  var cameraPositiontoUpdate = uniforms[1].data;

  uniforms.push(new UniformObject(modelMatrixUniform, modelMatrix.elements, function () {
    gl.uniformMatrix4fv(this.uniform, true, this.data);
  }));

  uniforms.push(new UniformObject(viewMatrixUniform, Camera.getViewMatrix().elements, function () {
    gl.uniformMatrix4fv(this.uniform, true, this.data);
  }));
  var viewMatrixtoUpdate = uniforms[3].data;

  uniforms.push(new UniformObject(projectionMatrixUniform, projectionMatrix.elements, function () {
    gl.uniformMatrix4fv(this.uniform, true, this.data);
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



    uniforms[1].data = Camera.position.elements;
    uniforms[3].data = Camera.getViewMatrix().elements;

    sponzaModel.draw(gl, program, uniforms);
    window.requestAnimationFrame(draw);
  }
}

