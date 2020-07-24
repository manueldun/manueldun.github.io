
var gl;


main();
function main() {

  var canvas = document.getElementById('c');

  const guiData = 
  {
    "X Angle":0.0,
    "Y Angle":0.0,
    "Z Angle":0.0,
    xPosition:0.0,
    yPosition:0.0,
    zPosition:0.0,
    getViewMatrix: function()
    {
      let xAxisViewMatrix = glMatrix.mat4.create();
      let yAxisViewMatrix = glMatrix.mat4.create();
      let zAxisViewMatrix = glMatrix.mat4.create();
      let xAxis = glMatrix.vec3.fromValues(1.0,0.0,0.0);
      let yAxis = glMatrix.vec3.fromValues(0.0,1.0,0.0);
      let zAxis = glMatrix.vec3.fromValues(0.0,0.0,1.0);
      glMatrix.mat4.fromRotation(xAxisViewMatrix,this["X Angle"]*(Math.PI/180),xAxis);
      glMatrix.mat4.fromRotation(yAxisViewMatrix,this["Y Angle"]*(Math.PI/180),yAxis);
      glMatrix.mat4.fromRotation(zAxisViewMatrix,this["Z Angle"]*(Math.PI/180),zAxis);
      
      let viewMatrix = glMatrix.mat4.create();

      glMatrix.mat4.mul(viewMatrix,viewMatrix,xAxisViewMatrix);
      glMatrix.mat4.mul(viewMatrix,viewMatrix,yAxisViewMatrix);
      glMatrix.mat4.mul(viewMatrix,viewMatrix,zAxisViewMatrix);

      
      return viewMatrix;
    }
  }
  let gui = new dat.GUI();
  gui.add(guiData,"X Angle",0,360);
  gui.add(guiData,"Y Angle",0,360);
  gui.add(guiData,"Z Angle",0,360);
  
  canvas.width = 1280;
  canvas.style.width = 720;
  canvas.width = 1280;
  canvas.style.height = 720;
  gl = canvas.getContext('webgl2');

  gl.clearColor(0.5, 0.5, 0.5, 1.0);
  gl.enable(gl.DEPTH_TEST);
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

  var inputLogic = initInputLogic(Camera,canvas);

  window.requestAnimationFrame(draw);

  var uniforms = [new UniformObject(samplerUniformLocation, 0, function () {
    gl.uniform1i(this.uniform, this.data);
  })];

  uniforms.push(new UniformObject(cameraPositionUniformLocation, Camera.position, function () {
    gl.uniform3fv(this.uniform, this.data);
  }));
  var cameraPositiontoUpdate = uniforms[1].data;

  uniforms.push(new UniformObject(modelMatrixUniformLocation, modelMatrix, function () {
    gl.uniformMatrix4fv(this.uniform, gl.FALSE, this.data);
  }));

  uniforms.push(new UniformObject(viewMatrixUniformLocation, Camera.getViewMatrix(), function () {
    gl.uniformMatrix4fv(this.uniform, gl.FALSE, this.data);
  }));
  var viewMatrixtoUpdate = uniforms[3].data;

  uniforms.push(new UniformObject(projectionMatrixUniformLocation, projectionMatrix, function () {
    gl.uniformMatrix4fv(this.uniform, gl.FALSE, this.data);
  }));

  //const shadowmapCube = createShadowMapCube(gl, -15, 15, -15, 15, -15, 15);
  
  const shadowmapDrawer = createShadowMap(gl,sponzaModel);
  const renderTextureDraw=renderTextureToScreen(gl);

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


    gl.clearColor(0.5,0.5,0.5,1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);


    uniforms[1].data = Camera.position;
    uniforms[3].data = Camera.getViewMatrix();

    const shadowmap=shadowmapDrawer(guiData.getViewMatrix(),projectionMatrix, Camera.getViewMatrix());

    
    sponzaModel.draw(gl, program, uniforms,1280,720,null);
    
    renderTextureDraw(gl,shadowmap,projectionMatrix, Camera.getViewMatrix());

    window.requestAnimationFrame(draw);
  }
}

