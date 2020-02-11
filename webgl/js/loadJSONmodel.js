function loadJSONmodel (gl, path) {
  var pathToFile = path.match('[A-Za-z0-9]*/[A-Za-z0-9]*/')[0];

  var modelJSON = JSON.parse(getString(path));
  console.log(modelJSON);
  var models = [];

  for (mesh of modelJSON.meshes) {
    var model = {};
    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    model.vao = vao;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.vertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.texturecoords[0]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);

    const normalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(mesh.normals), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

    const indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(mesh.faces.flat()), gl.STATIC_DRAW);

    model.count = mesh.faces.flat().length;

    const material = modelJSON.materials[mesh.materialindex];

    for (property of material.properties) {
      if (property.key === '$tex.file' && property.semantic === 1) {
        model.diffuseTexture = loadImage(gl, pathToFile.concat(property.value));
      }
      if (property.key === '$tex.file' && property.semantic === 5) {
        model.bumpTexture = loadImage(gl, pathToFile.concat(property.value));
      }
    }
    models.push(model);
  }
  model.draw = function (gl, program, uniforms) {
    for (uniform of uniforms) {
      uniform.setUniform();
    }
    gl.useProgram(program);
    for (var i in models) {
      gl.bindVertexArray(models[i].vao);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, models[i].diffuseTexture);

      gl.drawElements(gl.TRIANGLES, models[i].count, gl.UNSIGNED_SHORT, 0);
    }
  };

  return model;
}

function loadImage (gl, path) {
  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);
  const level = 0;
  const internalFormat = gl.SRGB8_ALPHA8;
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

    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  };
  image.src = path;
  return texture;
}
