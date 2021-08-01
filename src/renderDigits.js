//loads digits 3d model and return a functions that draws it
function initDigits(gl) {

    const vertexShaderSource =
      `attribute vec3 a_position;
      attribute vec3 a_normal;
      uniform float u_aspectRatio;
      uniform mat4 u_rotationMatrix;
      uniform vec3 u_objectPosition;
      varying  vec3 v_normal;
      void main()
      {
          v_normal=(u_rotationMatrix*vec4(a_normal,1.0)).xyz;
          gl_Position=(u_rotationMatrix*vec4(((a_position)*0.3),1.0))*vec4(u_aspectRatio,1.0,1.0,1.0)+vec4(u_objectPosition,0.0);
      }`;
  
  
  
    const fragmentShaderSource =
      `precision mediump float;
      varying vec3 v_normal;
      void main()
      {
        vec3 lightDirection=normalize(vec3(1.0,1.0,-1.0));
          gl_FragColor = vec4((vec3(0.2, 0.5, 0.25)*0.5)*dot(v_normal,lightDirection)+vec3(0.2, 0.5, 0.25)*0.5,1.0);
      }`;
  
    const program = compileShaders(gl, vertexShaderSource, fragmentShaderSource);
  
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    let normalAttributeLocation = gl.getAttribLocation(program, "a_normal");
  
    let aspectRatioUniform = gl.getUniformLocation(program, "u_aspectRatio");
    let rotationMatrixUniform = gl.getUniformLocation(program, "u_rotationMatrix");
    let objecPositionUniform = gl.getUniformLocation(program, "u_objectPosition");
  
  
    async function loadData() {
      const ceroGLTFpromise = getStringFile("/assets/", "cero.gltf");
      const unoGLTFpromise = getStringFile("/assets/", "uno.gltf");
      const zeroObject = JSON.parse(await ceroGLTFpromise);
      const oneObject = JSON.parse(await unoGLTFpromise);
  
      const zeroBufferUris = zeroObject.buffers.map((buffer) => {
        return buffer.uri;
      });
      const oneBufferUris = oneObject.buffers.map((buffer) => {
        return buffer.uri;
      });
  
      let zeroBufferPromises = [];
      for (let i = 0; i < zeroBufferUris.length; i++) {
  
        zeroBufferPromises.push(getBinaryFile("/assets/", zeroBufferUris[i]));
      }
  
      let unoBufferPromises = [];
      for (let i = 0; i < oneBufferUris.length; i++) {
        unoBufferPromises.push(getBinaryFile("/assets/", oneBufferUris[i]));
      }
  
      let zeroBuffers = [];
      for (let i = 0; i < zeroBufferUris.length; i++) {
        zeroBuffers.push(await zeroBufferPromises[i]);
      }
  
      let unoBuffers = [];
      for (let i = 0; i < oneBufferUris.length; i++) {
        unoBuffers.push(await unoBufferPromises[i]);
      }
  
  
  
  
      let zeroBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, zeroBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, zeroBuffers[0], gl.STATIC_DRAW);
  
  
      const indexBufferzero = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferzero);
  
      let offsetzero = zeroObject.bufferViews[zeroObject.meshes[0].primitives[0].indices].byteOffset;
      let sizezero = zeroObject.bufferViews[zeroObject.meshes[0].primitives[0].indices].byteLength;
  
      const indexBufferzeroSlice = zeroBuffers[0].slice(offsetzero, offsetzero + sizezero);
  
  
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexBufferzeroSlice, gl.STATIC_DRAW);
  
  
      const oneBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, oneBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, unoBuffers[0], gl.STATIC_DRAW);
  
  
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.enableVertexAttribArray(normalAttributeLocation);
  
  
  
  
  
      const indexBufferone = gl.createBuffer()
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferone);
  
      let offsetone = oneObject.bufferViews[oneObject.meshes[0].primitives[0].indices].byteOffset;
      let sizeone = oneObject.bufferViews[oneObject.meshes[0].primitives[0].indices].byteLength;
      const indexBufferoneSlice = unoBuffers[0].slice(offsetone, offsetone + sizeone);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexBufferoneSlice, gl.STATIC_DRAW);
  
      let digits = [];
  
      for (let i = 0; i < 60; i++) {
        digits.push(new Digit3D());
  
      }
      gl.bindBuffer(gl.ARRAY_BUFFER,null);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,null);
      return (width,height) => {
  
        gl.enable(gl.DEPTH_TEST);
        gl.useProgram(program);
  
        gl.uniform1f(aspectRatioUniform, height / width);
        for (const digit of digits) {
          gl.uniform3fv(objecPositionUniform, digit.getPosition(Date.now()));
  
          gl.uniformMatrix4fv(rotationMatrixUniform, false, digit.getRotation(Date.now()));
          if (digit.digit === 0) {
  
            gl.bindBuffer(gl.ARRAY_BUFFER, zeroBuffer);
            const positionSizezero = 3;
            const positionTypezero = gl.FLOAT;
            const positionNormalizezero = false;
            const positionStridezero = 0;
            const positionOffsetzero = zeroObject.bufferViews[zeroObject.meshes[0].primitives[0].attributes.POSITION].byteOffset;
            gl.vertexAttribPointer(
              positionAttributeLocation,
              positionSizezero,
              positionTypezero,
              positionNormalizezero,
              positionStridezero,
              positionOffsetzero
            );
  
  
            const normalSizezero = 3;
            const normalTypezero = gl.FLOAT;
            const normalNormalizezero = false;
            const normalStridezero = 0;
            const normalOffsetzero = zeroObject.bufferViews[zeroObject.meshes[0].primitives[0].attributes.NORMAL].byteOffset;
  
            gl.vertexAttribPointer(
              normalAttributeLocation,
              normalSizezero,
              normalTypezero,
              normalNormalizezero,
              normalStridezero,
              normalOffsetzero
            );
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferzero);
  
            var primitiveType = gl.TRIANGLES;
            var count = 6912;
            let indexType = gl.UNSIGNED_SHORT;
            var offset = 0;
            gl.drawElements(primitiveType, count, indexType, offset);
  
          }
          else {
  
            gl.bindBuffer(gl.ARRAY_BUFFER, oneBuffer);
            const positionSizeone = 3;
            const positionTypeone = gl.FLOAT;
            const positionNormalizeone = false;
            const positionStrideone = 0;
            const positionOffsetone = oneObject.bufferViews[oneObject.meshes[0].primitives[0].attributes.POSITION].byteOffset;
  
            gl.vertexAttribPointer(
              positionAttributeLocation,
              positionSizeone,
              positionTypeone,
              positionNormalizeone,
              positionStrideone,
              positionOffsetone
            );
  
  
            const normalSizeone = 3;
            const normalTypeone = gl.FLOAT;
            const normalNormalizeone = false;
            const normalStrideone = 0;
            const normalOffsetone = oneObject.bufferViews[oneObject.meshes[0].primitives[0].attributes.NORMAL].byteOffset;
  
            gl.vertexAttribPointer(
              normalAttributeLocation,
              normalSizeone,
              normalTypeone,
              normalNormalizeone,
              normalStrideone,
              normalOffsetone
            );
  
  
  
            gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferone);
  
            var primitiveType = gl.TRIANGLES;
            var count = 276;
            let indexType = gl.UNSIGNED_SHORT;
            var offset = 0;
            gl.drawElements(primitiveType, count, indexType, offset);
  
          }
          
        }
      };
    };
    return loadData();
  
  }