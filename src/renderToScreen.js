

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
    uniform sampler2D u_texture;
    uniform vec2 u_canvasSize;
    uniform bool u_horizontal;
    void main()
    {
        vec2 screenCoord = gl_FragCoord.rg/u_canvasSize;

        float weight[5];
        weight[0]=0.227027;
        weight[1]=0.1945946;
        weight[2]=0.1216216;
        weight[3]=0.054054;
        weight[4]=0.016216;
        vec3 result = texture2D(u_texture, gl_FragCoord.rg/u_canvasSize).rgb * weight[0]; // current fragment's contribution
        if(u_horizontal)
        {
            for(int i = 1; i < 5; ++i)
            {
                result += texture2D(u_texture, (gl_FragCoord.rg + vec2( i, 0.0))/u_canvasSize).rgb * weight[i];
                result += texture2D(u_texture, (gl_FragCoord.rg - vec2( i, 0.0))/u_canvasSize).rgb * weight[i];
            }
        }
        else
        {
            for(int i = 1; i < 5; ++i)
            {
                result += texture2D(u_texture, (gl_FragCoord.rg + vec2(0.0, i))/u_canvasSize).rgb * weight[i];
                result += texture2D(u_texture, (gl_FragCoord.rg - vec2(0.0, i))/u_canvasSize).rgb * weight[i];
            }
        }
        
        gl_FragColor = vec4(result,1.0);
    }`;
    const program = compileShaders(gl, vertexShaderSource, fragmentShaderSource);


    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);

    const screenTrianglebuffer = new Float32Array(
        [-1.0, -1.0,
        -1.0, 2.0 + Math.sin(45) * 2.0,
        2.0 + Math.sin(45) * 2.0, -1.0,
        ]);

    let triangleGLBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleGLBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, screenTrianglebuffer, gl.STATIC_DRAW);

    gl.useProgram(program);
    var textureLocation = gl.getUniformLocation(program, "u_texture");
    var horizontalLocation = gl.getUniformLocation(program, "u_horizontal");
    var canvasSizeLocation = gl.getUniformLocation(program, "u_canvasSize");
    return function (texture,canvas,horizontal) {

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

        gl.uniform1i(textureLocation, 0);
        gl.uniform2f(canvasSizeLocation, canvas.width, canvas.height);
        if(horizontal)
        {
            gl.uniform1i(horizontalLocation, 0);
        }
        else{
            gl.uniform1i(horizontalLocation, 1);
        }
        gl.bindTexture(gl.TEXTURE_2D,texture);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
}