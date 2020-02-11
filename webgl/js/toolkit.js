function getString(path, onReady) {
  var client = new XMLHttpRequest();
  client.open('GET', path, false);
  client.addEventListener('load', onReady);
  client.send();
  return client.responseText;
}
class Textures {
  constructor(path, index) {
    this.materialName = name;
    this.index = index;
    this.map_Ka_path = null;
    this.map_Ks_path = null;
    this.map_Kd_path = null;
    this.map_bump_path = null;
    this.map_Ka = null;
    this.map_Ks = null;
    this.map_Kd = null;
    this.map_bump = null;
  }

  getGLTextures() {
    if (this.map_Ka_path !== null) {
      this.map_Ka = gl.createTexture();
      let texture = this.map_Kd;
      gl.bindTexture(gl.TEXTURE_2D, this.map_Ka);

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

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      };
      image.src = 'Assets/cube/'.concat(this.map_Ka_path);
    }
    if (this.map_Ks_path !== null) {
      this.map_Ks = gl.createTexture();

      let texture = this.map_Kd;
      gl.bindTexture(gl.TEXTURE_2D, this.map_Ks);

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
      image.src = 'Assets/cube/'.concat(this.map_Ks_path);
    }
    if (this.map_bump_path !== null) {
      this.map_bump = gl.createTexture();
      let texture = this.map_Kd;
      gl.bindTexture(gl.TEXTURE_2D, this.map_bump);

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
      image.src = 'Assets/cube/'.concat(this.map_bump_path);
    }
    if (this.map_Kd_path !== null) {
      this.map_Kd = gl.createTexture();
      let texture = this.map_Kd;
      gl.bindTexture(gl.TEXTURE_2D, this.map_Kd);

      const level = 0;
      const internalFormat = gl.RGBA;
      const width = 1;
      const height = 1;
      const border = 0;
      const srcFormat = gl.RGBA;
      const srcType = gl.UNSIGNED_BYTE;
      const pixel = new Uint8Array([0, 0, 255, 255]);
      gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, srcFormat, srcType, pixel);
      // const image = new Image();
      // image.onload = function () {
      //  gl.bindTexture(gl.TEXTURE_2D, texture);
      //  gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);

      //  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      //  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      //  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      // };
      // image.src = 'Assets/cube/'.concat(this.map_Kd_path);
    }
  }
}

function fetchOBJTexturesPaths(objFilePath, material) {
  var rawText = getString(objFilePath);
  var arrayOfLines = rawText.split('\n');

  var arrayOfTextures = [];
  var textures;

  for (var i = 0; i < arrayOfLines.length; i++) {
    var arrayOfWords = arrayOfLines[i].trim().split(' ');
    if (arrayOfWords[0] === 'newmtl') {
      textures = new Textures(arrayOfWords[1], material);
      arrayOfTextures.push(textures);
    }

    switch (arrayOfWords[0]) {
      case 'map_Ks':
        textures.map_Ks_path = arrayOfWords[1];
        break;
      case 'map_Ka':
        textures.map_Ka_path = arrayOfWords[1];
        break;
      case 'map_Kd':
        textures.map_Kd_path = arrayOfWords[1];
        break;
      case 'map_bump':
        textures.map_bump_path = arrayOfWords[1];
        break;
      default:
    }
  }
  return arrayOfTextures;
}

function getShadowMapDraw(gl, model) {

  const depthTexture = gl.createTexture();
  const depthTextureSize = 512;
  gl.bindTexture(gl.TEXTURE_2D, depthTexture);
  gl.texImage2D(
    gl.TEXTURE_2D,      // target
    0,                  // mip level
    gl.DEPTH_COMPONENT32F, // internal format
    1024,   // width
    1024,   // height
    0,                  // border
    gl.DEPTH_COMPONENT, // format
    gl.FLOAT,           // type
    null);              // data
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const depthFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,       // target
    gl.DEPTH_ATTACHMENT,  // attachment point
    gl.TEXTURE_2D,        // texture target
    depthTexture,         // texture
    0);                   // mip level


  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, 'shaders/shadowMap/shadowMap.fs');
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, 'shaders/shadowMap/shadowMap.vs');

  var program = createProgram(gl, vertexShader, fragmentShader);

  var modelMatrixUniform = gl.getUniformLocation(program, 'modelMatrix');
  var modelMatrix = glm.mat4(1.0);
  var viewMatrixUniform = gl.getUniformLocation(program, 'viewMatrix');
  var viewMatrix = glm.translate(glm.rotate(glm.mat4(1.0), glm.degrees(30.0), glm.vec3(1.0, 0.0, 0.0)), glm.vec3(0.0, -25.0, 10.0));
  var projectionMatrixUniform = gl.getUniformLocation(program, 'projectionMatrix');
  var projectionMatrix = glm.ortho(100.0, 100.0, 100.0, 100.0);

  var uniforms = [];
  uniforms.push(new UniformObject(modelMatrixUniform, modelMatrix.elements, function () {
    gl.uniformMatrix4fv(this.uniform, true, this.data);
  }));

  uniforms.push(new UniformObject(viewMatrixUniform, viewMatrix.elements, function () {
    gl.uniformMatrix4fv(this.uniform, true, this.data);
  }));

  uniforms.push(new UniformObject(projectionMatrixUniform, projectionMatrix.elements, function () {
    gl.uniformMatrix4fv(this.uniform, true, this.data);
  }));
  return function () {
    gl.viewport(0,0,1042,1024);
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
    model.draw(gl, program, uniforms);
  }
}