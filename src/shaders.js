//compile and link glsl shaders
function compileShaders(gl, vertexShaderSource, fragmentShaderSource) {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vertexShaderSource);
    gl.compileShader(vertexShader);
    var success = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);

    if (!success) {
        console.log(gl.getShaderInfoLog(vertexShader));
        gl.deleteShader(vertexShader);
        return;
    }
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
    return program;
}
