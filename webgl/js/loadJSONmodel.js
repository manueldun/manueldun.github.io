
function loadJSONmodel(gl, path) {
  var pathToFile = path.match('[A-Za-z0-9]*/[A-Za-z0-9]*/')[0];

  var modelJSON = JSON.parse(getString(path));

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
    gl.useProgram(program);
    for (uniform of uniforms) {
      uniform.setUniform();
    }
    for (var i in models) {
      gl.bindVertexArray(models[i].vao);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, models[i].diffuseTexture);

      gl.drawElements(gl.TRIANGLES, models[i].count, gl.UNSIGNED_SHORT, 0);
    }
  };

  return model;
}

function loadImage(gl, path) {
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
function loadOBJModel(gl, path, OBJFilename, MTLFilename) {
  var objStr = getString(path.concat("/").concat(OBJFilename));
  var importedMeshData = new OBJ.Mesh(objStr);
  //importedMeshData.calculateTangentsAndBitangents();
  
  console.log(importedMeshData);


  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(importedMeshData.vertices), gl.STATIC_DRAW);

  const uvBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(importedMeshData.textures), gl.STATIC_DRAW);

  const normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(importedMeshData.vertexNormals), gl.STATIC_DRAW);

  var mtlStr = getString(path.concat("/").concat(MTLFilename));
  var importedMaterialData = new OBJ.MaterialLibrary(mtlStr);



  var model = {};
  model.drawDatas = [];


  for (const i in importedMeshData.indicesPerMaterial) {
    var drawData = {};
    var materialName = importedMeshData.materialNames[i]


    var difuseFileName = importedMaterialData.materials[materialName].mapDiffuse.filename;


    var difuseMapFullPath = path.concat("/").concat(difuseFileName);

    var diffuseTexture = loadImage(gl, difuseMapFullPath);
    drawData.glDiffuseTexture = diffuseTexture;

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    drawData.vao = vao;

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE, 2 * Float32Array.BYTES_PER_ELEMENT, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
    gl.enableVertexAttribArray(2);
    gl.vertexAttribPointer(2, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

    drawData.numberOfIndices = importedMeshData.indicesPerMaterial[i].length;

    const indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indicesBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(importedMeshData.indicesPerMaterial[i]), gl.STATIC_DRAW);


    model.drawDatas.push(drawData);
  }


  model.draw = function (gl, program, uniforms) {
    for (uniform of uniforms) {
      uniform.setUniform();
    }
    gl.useProgram(program);

    for (const data of model.drawDatas) {

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, data.glDiffuseTexture);


      gl.bindVertexArray(data.vao);
      gl.drawElements(gl.TRIANGLES, data.numberOfIndices, gl.UNSIGNED_SHORT, 0);

    }
  };

  return model;
}

function doenloadOBJmeshes(gl, path) {
  let mesh;
  Obj.downloadMeshes({
    'sponza': path, function(meshes) {
      mesh = meshes.sponza;
      OBJ.initMeshBuffers(gl, mesh);
    }
  });
  mesh.draw = function (gl) {

  };
  return mesh;

}

