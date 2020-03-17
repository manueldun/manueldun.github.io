function createShadowMapCube(gl, left, right, bottom, top, near, far) {
    let leftTopNearVertex = [left, top, near];
    let rightTopNearVertex = [right, top, near];
    let rightBottomNearVertex = [right, bottom, near];
    let leftBottomNearVertex = [left, bottom, near];

    let leftTopFarVertex = [left, top, far];
    let rightTopFarVertex = [right, top, far];
    let rightBottomFarVertex = [right, bottom, far];
    let leftBottomFarVertex = [left, bottom, far];

    let vertexArray = [
        leftTopNearVertex,
        rightTopNearVertex,
        rightBottomNearVertex,
        leftBottomNearVertex,
        leftTopFarVertex,
        rightTopFarVertex,
        rightBottomFarVertex,
        leftBottomFarVertex
    ];
    let nearArray = [0, 1, 2, 3];
    let farArray = [4, 5, 6, 7];
    let sideArray = [0, 4, 1, 5, 2, 6, 3, 7];

    console.log(vertexArray.flat());
    

    const mapCubePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, mapCubePositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexArray.flat()), gl.STATIC_DRAW);


    const nearVAO = gl.createVertexArray();
    gl.bindVertexArray(nearVAO);

    gl.bindBuffer(gl.ARRAY_BUFFER, mapCubePositionBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

    const nearElemetBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, nearElemetBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(nearArray), gl.STATIC_DRAW);


    const farVAO = gl.createVertexArray();
    gl.bindVertexArray(farVAO);

    gl.bindBuffer(gl.ARRAY_BUFFER, mapCubePositionBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);


    const farElemetBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, farElemetBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(farArray), gl.STATIC_DRAW);



    const sideVAO = gl.createVertexArray();
    gl.bindVertexArray(sideVAO);

    gl.bindBuffer(gl.ARRAY_BUFFER, mapCubePositionBuffer);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0);

    const sidesElemetBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sidesElemetBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(sideArray), gl.STATIC_DRAW);
    
    const vertexShaderString =
        `#version 300 es
    precision mediump float;
    uniform mat4 viewMatrix;
    uniform mat4 projectionMatrix;
    
    layout(location=0)in vec3 position;
    void main()
    {
        gl_Position = projectionMatrix*viewMatrix*vec4(position,1.0);
    }
    `;
    const fragmentShaderString =
        `#version 300 es
    precision mediump float;
    uniform vec3 color;
    out vec4 outColor;
    void main()
    {
        outColor = vec4(color,1.0);
    }
    `;
    let vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderString);
    let fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderString);

    let programShader = createProgram(gl, vertexShader, fragmentShader);

    let colorUniformLocation = gl.getUniformLocation(programShader, 'color');


    let viewMatrixLocation = gl.getUniformLocation(programShader, 'viewMatrix');
    let projectionMatrixLocation = gl.getUniformLocation(programShader, 'projectionMatrix');


    const redColorVector = glMatrix.vec3.fromValues(1.0, 0.0, 0.0);
    const greenColorVector = glMatrix.vec3.fromValues(0.0, 1.0, 0.0);
    const blueColorVector = glMatrix.vec3.fromValues(0.0, 0.0, 1.0);

    const draw = function (gl, projectionMatrix, viewMatrix) {
        gl.useProgram(programShader);
        gl.uniform3fv(colorUniformLocation, redColorVector);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.bindVertexArray(nearVAO);
        gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_SHORT, 0);

        gl.uniform3fv(colorUniformLocation, greenColorVector);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.bindVertexArray(sideVAO);
        gl.drawElements(gl.LINES, 8, gl.UNSIGNED_SHORT, 0);

        gl.uniform3fv(colorUniformLocation, blueColorVector);
        gl.uniformMatrix4fv(viewMatrixLocation, false, viewMatrix);
        gl.uniformMatrix4fv(projectionMatrixLocation, false, projectionMatrix);
        gl.bindVertexArray(farVAO);
        gl.drawElements(gl.LINE_LOOP, 4, gl.UNSIGNED_SHORT, 0);
    };
    return draw;
}