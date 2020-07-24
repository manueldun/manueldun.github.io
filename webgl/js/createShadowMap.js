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
        gl.viewport(0, 0, 1280, 720);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
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
function createShadowMap(gl, model) {
    const shadowMapTexture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, shadowMapTexture);

    gl.texImage2D(
        gl.TEXTURE_2D,      // target
        0,                  // mip level
        gl.DEPTH_COMPONENT32F, // internal format
        512,   // width
        512,   // height
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
        shadowMapTexture,         // texture
        0);                   // mip level

    gl.clear(gl.COLOR_BUFFER_BIT);
    const shadowMapVertexShader = createShader(gl, gl.VERTEX_SHADER, getString("shaders/forwardShading/forwardShading.vs"));
    const shadowMapFragmentShader = createShader(gl, gl.FRAGMENT_SHADER, getString("shaders/forwardShading/forwardShading.fs"));
    const shadowMapShaderProgram = createProgram(gl, shadowMapVertexShader, shadowMapFragmentShader);


    const modelMatrixUniformLocation = gl.getUniformLocation(shadowMapShaderProgram, 'modelMatrix');
    const modelMatrix = glMatrix.mat4.create();
    const modelMatrixUniform = new UniformObject(modelMatrixUniformLocation, modelMatrix, function () {
        gl.uniformMatrix4fv(this.uniform, gl.FALSE, this.data);
    });


    const viewMatrixUniformLocation = gl.getUniformLocation(shadowMapShaderProgram, 'viewMatrix');
    const viewMatrix = glMatrix.mat4.create();
    const viewMatrixUniform = new UniformObject(viewMatrixUniformLocation, viewMatrix, function () {
        gl.uniformMatrix4fv(this.uniform, gl.FALSE, this.data);
    });


    const projectionMatrixUniformLocation = gl.getUniformLocation(shadowMapShaderProgram, 'projectionMatrix');
    const projectionMatrix = glMatrix.mat4.create();
    glMatrix.mat4.ortho(projectionMatrix, -15, 15, -15, 15, -15, 15);
    const projectionMatrixUniform = new UniformObject(projectionMatrixUniformLocation, projectionMatrix, function () {
        gl.uniformMatrix4fv(this.uniform, gl.FALSE, this.data);
    });
    const uniforms = [modelMatrixUniform, viewMatrixUniform, projectionMatrixUniform];

    let drawShadowMapCube=createShadowMapCube(gl, -15, 15, -15, 15, -15, 15);
    return function(viewMatrix,cubeProjectionMatrix,cubeViewMatrix)
    {   
        let shadowCubeViewMatrix = glMatrix.mat4.create();
        glMatrix.mat4.mul(shadowCubeViewMatrix,cubeViewMatrix,viewMatrix);
        drawShadowMapCube(gl,cubeProjectionMatrix,shadowCubeViewMatrix);


        gl.bindFramebuffer(gl.FRAMEBUFFER, depthFramebuffer);
        viewMatrixUniform.data = viewMatrix;
        gl.clearColor(1.0,1.0,1.0,1.0);
        gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    
        model.draw(gl, shadowMapShaderProgram, uniforms, 512, 512, depthFramebuffer);
        return shadowMapTexture;
    };

}
function renderTextureToScreen(gl) {
    
    const squareVertices =
        [
            -0.5, -0.5, 0,
            -0.5, 0.5, 0,
            0.5, -0.5, 0,
            0.5,0.5,0
        ];
        const textureCoordinates =
        [
            0, 0,
            0, 1,
            1, 0,
            1, 1

        ];

    const squareVAO = gl.createVertexArray();
    gl.bindVertexArray(squareVAO);

    const squareBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, squareBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(squareVertices), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 3, gl.FLOAT, gl.FALSE, 0, 0);

    const uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoordinates), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(1);
    gl.vertexAttribPointer(1, 2, gl.FLOAT, gl.FALSE, 0, 0);

    const textureToQuadVertexShaderString =
        `#version 300 es
    precision mediump float;

    out vec2 v_uv;

    layout(location=0)in vec3 position;
    layout(location=1)in vec2 uv;

    void main()
    {
        v_uv=uv;
        gl_Position = vec4(position.xyz,1.0);
    }
    `;
    const textureToQuadFragmentShaderString =
        `#version 300 es
    precision mediump float;
    uniform sampler2D shadowmap;

    in vec2 v_uv;

    out vec4 outColor;
    void main()
    {
        outColor = vec4(vec3(texture(shadowmap,v_uv).r),1.0);
    }
    `;

    const textureToScreenShader = createShaderFromSource(
        gl,
        textureToQuadVertexShaderString,
        textureToQuadFragmentShaderString);

      
      
    const samplerUniformLocation = gl.getUniformLocation(textureToScreenShader, "shadowmap");
    return function (gl,texture) {
        gl.bindFramebuffer(gl.FRAMEBUFFER,null);
        gl.viewport(0,0,512,512);
        gl.useProgram(textureToScreenShader);
        gl.bindVertexArray(squareVAO);
        gl.uniform1i(samplerUniformLocation, 0);

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    }
}