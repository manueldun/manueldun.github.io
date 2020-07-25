import { getStringFile, getBinaryFile } from "./loadGLTF/loadGLTF.js";
function rotationMatrixX(angle) {
  return new Float32Array([
    1, 0, 0, 0,
    0, Math.cos(angle), -Math.cos(angle), 0,
    0, Math.sin(angle), Math.sin(angle), 0,
    0, 0, 0, 1]);
}
function rotationMatrixY(angle) {
  return new Float32Array(
    [
      Math.cos(angle), 0, Math.sin(angle), 0,
      0, 1, 0, 0,
      -Math.sin(angle), 0, Math.cos(angle), 0,
      0, 0, 0, 1
    ]);
}
function matrizDeRotacionZ(angle) {
  return new Float32Array(
    [
      Math.cos(angle), -Math.sin(angle), 0, 0,
      Math.sin(angle), -Math.cos(angle), 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
}
function rotationMatrixXY(angleA, angleB) {
  return new Float32Array([
    Math.cos(angleA), 0, Math.sin(angleA), 0,
    Math.sin(angleA) * Math.cos(angleB), Math.cos(angleB), -Math.cos(angleA) * Math.cos(angleB), 0,
    -Math.sin(angleA) * Math.sin(angleB), Math.sin(angleB), Math.cos(angleA) * Math.sin(angleB), 0,
    0, 0, 0, 1
  ]);

}
function quaternionMatrix(x, y, z, angle) {
  let qx = x * Math.sin(angle / 2);
  let qy = y * Math.sin(angle / 2);
  let qz = z * Math.sin(angle / 2);
  let qw = Math.cos(angle / 2);
  const length = Math.sqrt(qx * qx + qy * qy + qz * qz + qw * qw);
  qx /= length;
  qy /= length;
  qz /= length;
  qw /= length;

  return new Float32Array([
    1 - 2 * (qy * qy + qz * qz), 2 * (qx * qy - qw * qz), 2 * (qx * qz + qw * qy), 0,
    2 * (qx * qy + qw * qz), 1 - 2 * (qx * qx + qz * qz), 2 * (qy * qz - qw * qx), 0,
    2 * (qx * qz - qw * qy), 2 * (qy * qz + qw * qx), 1 - 2 * (qx * qx + qy * qy), 0,
    0, 0, 0, 1
  ]);
}

//privates

class Digit3D {
  constructor() {
    this.digit = Math.floor(Math.random() * Math.floor(2));
    this.position = [Math.random() * 2 - 1, Math.random() * 2 - 1, 0];
    this.rotationAxis = [Math.random(), Math.random(), Math.random()];
    const length = Math.sqrt(
      this.rotationAxis[0] * this.rotationAxis[0] +
      this.rotationAxis[1] * this.rotationAxis[1] +
      this.rotationAxis[2] * this.rotationAxis[2]);
    this.rotationAxis = [
      this.rotationAxis[0] / length,
      this.rotationAxis[1] / length,
      this.rotationAxis[2] / length];

    this.speed = [Math.random() * 2 - 1, Math.random() * 2 - 1, 0];
    this.lastTime = Date.now();
  };
  getRotation(time) {
    return quaternionMatrix(this.rotationAxis[0], this.rotationAxis[1], this.rotationAxis[2], time * 0.002)
  }
  getPosition(time) {
    const delta = time - this.lastTime;
    this.lastTime = time;

    this.position[0] += this.speed[0] * delta * 0.0001;
    this.position[1] += this.speed[1] * delta * 0.0001;
    this.position[2] += this.speed[2] * delta * 0.0001;


    if (this.position[0] >= 1.2) {
      this.position[0] = -1.2;
    } else if (this.position[0] <= -1.2) {
      this.position[0] = 1.2;
    }

    if (this.position[1] >= 1.2) {
      this.position[1] = -1.2;
    } else if (this.position[1] <= -1.2) {
      this.position[1] = 1.2;
    }


    return this.position;

  }
}
function animar() {
  const canvas = document.getElementById("animation");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  gl.enable(gl.DEPTH_TEST);
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);


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

  var vertexShader = gl.createShader(gl.VERTEX_SHADER);
  gl.shaderSource(vertexShader, vertexShaderSource);
  gl.compileShader(vertexShader);
  var success = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);

  if (!success) {
    console.log(gl.getShaderInfoLog(vertexShader));
    gl.deleteShader(vertexShader);
    return;
  }

  const fragmentShaderSource =
    `precision mediump float;
    varying vec3 v_normal;
    void main()
    {
      vec3 lightDirection=normalize(vec3(1.0,1.0,-1.0));
        gl_FragColor = vec4((vec3(0.2, 0.5, 0.25)*0.5)*dot(v_normal,lightDirection)+vec3(0.2, 0.5, 0.25)*0.5,1.0);
    }`;

  var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
  gl.shaderSource(fragmentShader, fragmentShaderSource);
  gl.compileShader(fragmentShader);
  var success = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);

  if (!success) {
    console.log(gl.getShaderInfoLog(fragmentShader));
    gl.deleteShader(fragmentShader);
    return;
  }

  const program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);

  if (!success) {
    console.log(gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return;
  }
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
  let normalAttributeLocation = gl.getAttribLocation(program, "a_normal");

  let aspectRatioUniform = gl.getUniformLocation(program, "u_aspectRatio");
  let rotationMatrixUniform = gl.getUniformLocation(program, "u_rotationMatrix");
  let objecPositionUniform = gl.getUniformLocation(program, "u_objectPosition");


  async function loadData() {
    const zeroObject = JSON.parse(await getStringFile("/assets/", "cero.gltf"));
    const oneObject = JSON.parse(await getStringFile("/assets/", "uno.gltf"));

    const zeroBufferUris = zeroObject.buffers.map((buffer) => {
      return buffer.uri;
    });
    const oneBufferUris = oneObject.buffers.map((buffer) => {
      return buffer.uri;
    });

    let zeroBuffers = [];
    for (let i = 0; i < zeroBufferUris.length; i++) {
      zeroBuffers.push(await getBinaryFile("/assets/", zeroBufferUris[i]));

    }

    let oneBuffers = [];
    for (let i = 0; i < oneBufferUris.length; i++) {
      oneBuffers.push(await getBinaryFile("/assets/", oneBufferUris[i]));
    }

    console.log(oneObject);


    gl.clearColor(0.004, 0.055, 0, 1);

    let zeroBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, zeroBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, zeroBuffers[0], gl.STATIC_DRAW);


    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(normalAttributeLocation);



    const indexBufferzero = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferzero);

    let offsetzero = zeroObject.bufferViews[zeroObject.meshes[0].primitives[0].indices].byteOffset;
    let sizezero = zeroObject.bufferViews[zeroObject.meshes[0].primitives[0].indices].byteLength;
    console.log(offsetzero);
    console.log(sizezero);
    const indexBufferzeroSlice = zeroBuffers[0].slice(offsetzero, offsetzero + sizezero);

    console.log(new Uint16Array(indexBufferzeroSlice));

    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexBufferzeroSlice, gl.STATIC_DRAW);


    const oneBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, oneBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, oneBuffers[0], gl.STATIC_DRAW);


    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.enableVertexAttribArray(normalAttributeLocation);





    const indexBufferone = gl.createBuffer()
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBufferone);

    let offsetone = oneObject.bufferViews[oneObject.meshes[0].primitives[0].indices].byteOffset;
    let sizeone = oneObject.bufferViews[oneObject.meshes[0].primitives[0].indices].byteLength;
    const indexBufferoneSlice = oneBuffers[0].slice(offsetone, offsetone + sizeone);
    console.log(new Uint16Array(indexBufferoneSlice));
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexBufferoneSlice, gl.STATIC_DRAW);

    let digits = [];

    for (let i = 0; i < 50; i++) {
      digits.push(new Digit3D());

    }

    const update = () => {

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      gl.useProgram(program);

      gl.uniform1f(aspectRatioUniform, canvas.clientHeight / canvas.clientWidth);
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
      window.requestAnimationFrame(update);
    };
    update();
  };

  loadData();
};
window.onload = animar;

