
var gl;


main();
function main() {

  var canvas = document.getElementById('c');

  canvas.width = 1280;
  canvas.style.width = 720;
  canvas.height = 1280;
  canvas.style.height = 720;
  gl = canvas.getContext('webgl2');

  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.lineWidth(5.0);
  //const  texturedBox = loadGLTFfile(gl,"Assets/BoxTextured/glTF/BoxTextured.gltf");
  //const sponzaModel =loadOBJModel(gl, "Assets/Sponza","sponza.obj","sponza.mtl");

  //const sponzaModel =loadOBJModel(gl, "Assets/Sponza/sponza.obj");

  const sponzaModel = loadJSONmodel(gl, 'Assets/Sponza/sponzatri.json');

  var vertexShader = createShaderFromPath(gl, gl.VERTEX_SHADER, 'shaders/forwardShading/forwardShading.vs');
  var fragmentShader = createShaderFromPath(gl, gl.FRAGMENT_SHADER, 'shaders/forwardShading/forwardShading.fs');

  var program = createProgram(gl, vertexShader, fragmentShader);

  var samplerUniformLocation = gl.getUniformLocation(program, 'diffuseTexture');
  var modelMatrixUniformLocation = gl.getUniformLocation(program, 'modelMatrix');
  var modelMatrix = glMatrix.mat4.create();

  var viewMatrixUniformLocation = gl.getUniformLocation(program, 'viewMatrix');

  var viewMatrix = Camera.getViewMatrix();

  var projectionMatrixUniformLocation = gl.getUniformLocation(program, 'projectionMatrix');
  


  //glMatrix.mat4.ortho(projectionMatrix, 50.0, -50.0, 50.0, -50.0, 50.0, -50.0);

  var projectionMatrix = glMatrix.mat4.create();
  glMatrix.mat4.perspective(projectionMatrix, 35 * (180 / Math.PI), 1280 / 720, 0.1, 1000);

  var cameraPositionUniformLocation = gl.getUniformLocation(program, 'cameraPosition');

  gl.useProgram(program);
  gl.uniform3fv(cameraPositionUniformLocation, Camera.position);
  gl.uniformMatrix4fv(modelMatrixUniformLocation, false, modelMatrix);
  gl.uniformMatrix4fv(viewMatrixUniformLocation, false, viewMatrix);
  gl.uniformMatrix4fv(projectionMatrixUniformLocation, false, projectionMatrix);

  var inputLogic = initInputLogic(Camera);

  window.requestAnimationFrame(draw);

  var uniforms = [new UniformObject(samplerUniformLocation, 0, function () {
    gl.uniform1i(this.uniform, this.data);
  })];

  uniforms.push(new UniformObject(cameraPositionUniformLocation, Camera.position, function () {
    gl.uniform3fv(this.uniform, this.data);
  }));
  var cameraPositiontoUpdate = uniforms[1].data;

  uniforms.push(new UniformObject(modelMatrixUniformLocation, modelMatrix, function () {
    gl.uniformMatrix4fv(this.uniform, false, this.data);
  }));

  uniforms.push(new UniformObject(viewMatrixUniformLocation, Camera.getViewMatrix(), function () {
    gl.uniformMatrix4fv(this.uniform, false, this.data);
  }));
  var viewMatrixtoUpdate = uniforms[3].data;

  uniforms.push(new UniformObject(projectionMatrixUniformLocation, projectionMatrix, function () {
    gl.uniformMatrix4fv(this.uniform, false, this.data);
  }));

  const shadowmapCube = createShadowMapCube(gl, -3, 3, -3, 3, -3, 3);


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

    shadowmapCube(gl, projectionMatrix, Camera.getViewMatrix());
    sponzaModel.draw(gl, program, uniforms);

    window.requestAnimationFrame(draw);
  }
}

