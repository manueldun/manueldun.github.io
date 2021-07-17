

function drawToScreenInit(gl) {
    const vertexShaderSource =
      `
    attribute vec2 a_position;
    void main()
    {
        gl_Position=vec4(a_position,0.0,1.0);
    }`;
  
    const fragmentShaderSource =
      `precision mediump float;
    void main()
    {
        gl_FragColor = vec4(0.0,1.0,0.0,1.0);
    }`;
    const program = compileShaders(gl, vertexShaderSource, fragmentShaderSource);
  
  
    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
  
    const screenTrianglebuffer = new Float32Array(
      [ -1.0, -1.0,
        -1.0, 2.0+Math.sin(45)*2.0,
        2.0+Math.sin(45)*2.0, -1.0,
      ]);
  
    let triangleGLBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGLBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, screenTrianglebuffer, gl.STATIC_DRAW);
  
    return function () {
      
    gl.disable(gl.DEPTH_TEST);
      gl.bindBuffer(gl.ARRAY_BUFFER, triangleGLBuffer);
      const positionSize = 2;
      const positionType = gl.FLOAT;
      const positionNormalize = false;
      const positionStride = 0;
      const positionOffset = 0;
      gl.vertexAttribPointer(
        positionAttributeLocation,
        positionSize,
        positionType,
        positionNormalize,
        positionStride,
        positionOffset
      );
      gl.enableVertexAttribArray(positionAttributeLocation);
      gl.useProgram(program);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
  }