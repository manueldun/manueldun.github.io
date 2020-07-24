import { getStringFile, getBinaryFile } from "./loadGLTF/loadGLTF.js";
function matrizDeRotacionX(angle) {
  return new Float32Array([
    1, 0, 0, 0,
    0, Math.cos(angle), Math.sin(angle), 0,
    0, Math.sin(angle), -Math.sin(angle), 0,
    0, 0, 0, 1]);
}
function matrizDeRotacionY(angle) {
  return new Float32Array(
    [
      Math.cos(angle), 0, -Math.sin(angle), 0,
      0, 1, 0, 0,
      Math.sin(angle), 0, Math.cos(angle), 0,
      0, 0, 0, 1
    ]);
}
function matrizDeRotacionZ(angle) {
  return new Float32Array(
    [
      Math.cos(angle), Math.sin(angle), 0, 0,
      -Math.sin(angle), -Math.cos(angle), 0,
      0, 0, 1, 0,
      0, 0, 0, 0
    ]);
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
    varying  vec3 v_normal;
    void main()
    {
        v_normal=(u_rotationMatrix*vec4(a_normal,1.0)).xyz;
        gl_Position=(u_rotationMatrix*vec4(a_position*0.5,1.0))*vec4(u_aspectRatio,1.0,1.0,1.0);
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
      vec3 lightDirection=-normalize(vec3(1.0,1.0,1.0));
        gl_FragColor = vec4(vec3(1, 1, 1)*dot(v_normal,lightDirection),1.0);
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

  let jsonObject;
  let arrayOfBuffers = [];

  getStringFile("/loadGLTF/", "testCube.gltf").
    then((jsonObjectText) => {
      jsonObject = JSON.parse(jsonObjectText);

      for (const buffer of jsonObject.buffers) {
        arrayOfBuffers.push(getBinaryFile("loadGLTF/", buffer.uri));
      }
      return arrayOfBuffers;
    }).then((arrayOfBuffers) => {
      Promise.all(arrayOfBuffers).then((buffers) => {

        let buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, buffers[0], gl.STATIC_DRAW);

        gl.clearColor(0.004, 0.055, 0, 1);

        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.enableVertexAttribArray(normalAttributeLocation);

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);

        console.log(jsonObject);

    

        
        var size = 3;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 0;
        gl.vertexAttribPointer(
          positionAttributeLocation,
          size,
          type,
          normalize,
          stride,
          offset
        );

        
        var size = 3;
        var type = gl.FLOAT;
        var normalize = false;
        var stride = 0;
        var offset = 288;
        gl.vertexAttribPointer(
          normalAttributeLocation,
          size,
          type,
          normalize,
          stride,
          offset
        );

        const indexBuffer = gl.createBuffer()
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,buffers[0].slice(576,576+72),gl.STATIC_DRAW);

        
  
        const update = () => {

          gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
          
          gl.useProgram(program);

          gl.uniform1f(aspectRatioUniform,canvas.clientHeight/canvas.clientWidth);
          gl.uniform1f(aspectRatioUniform,canvas.clientHeight/canvas.clientWidth);
          gl.uniformMatrix4fv(rotationMatrixUniform,false,matrizDeRotacionY(Date.now()*0.001));

          gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer,);

          var primitiveType = gl.TRIANGLES;
          var offset = 0;
          var count =36;
          let indexType = gl.UNSIGNED_SHORT;
          gl.drawElements(primitiveType, count, indexType, offset);
          window.requestAnimationFrame(update);
        };

        update();
      });
    });
};
window.onload = animar;

