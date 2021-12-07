
function initLightning(gl, position1, position2) {
    const vertexShaderSource =
        `
    attribute vec3 a_position;
    void main()
    {
        gl_Position = vec4(a_position,1.0);
    }
    `;
    const fragmentShaderSource =
        `precision mediump float;
    void main()
    {
        gl_FragColor = vec4(0.5,1.0,0.5,1.0);
    }
    `;

    const program = compileShaders(gl, vertexShaderSource, fragmentShaderSource);

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    const upVector = [0, 1, 0];
    const lightningDirectionZ = normalize3([
        position1[0] - position2[0],
        position1[1] - position2[1],
        position1[2] - position2[2]
    ]);
    const sideVectorX = normalize3(cross(lightningDirectionZ, upVector));
    const orthogonalVectorY = cross(sideVectorX, lightningDirectionZ)
    const angle = -Math.PI/3;
    const displacementDirection = [Math.cos(angle), Math.sin(angle), 0.0];
    const displacementDirectionOthogonal = [
        displacementDirection[0] * sideVectorX[0] +
        displacementDirection[1] * sideVectorX[1] +
        displacementDirection[2] * sideVectorX[2]
        ,
        displacementDirection[0] * orthogonalVectorY[0] +
        displacementDirection[1] * orthogonalVectorY[1] +
        displacementDirection[2] * orthogonalVectorY[2]
        ,
        displacementDirection[0] * lightningDirectionZ[0] +
        displacementDirection[1] * lightningDirectionZ[1] +
        displacementDirection[2] * lightningDirectionZ[2]
    ];
    const middlePosition =
        [(position1[0] + position2[0]) / 2.0,
        (position1[1] + position2[1]) / 2.0,
        (position1[2] + position2[2]) / 2.0];
    const displacement = 0.3;
    const displacedMiddlePosition =
        [
            middlePosition[0] + displacementDirectionOthogonal[0] * displacement,
            middlePosition[1] + displacementDirectionOthogonal[1] * displacement,
            middlePosition[2] + displacementDirectionOthogonal[2] * displacement,

        ];
    const positionBuffer = new Float32Array([...position1, ...displacedMiddlePosition, ...position2]);

    let lightningBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lightningBufferObject);
    gl.bufferData(gl.ARRAY_BUFFER, positionBuffer, gl.STATIC_DRAW);
    console.log(position1);
    console.log(position2);
    console.log(middlePosition);
    console.log(positionBuffer);
    return function () {

        gl.useProgram(program);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, lightningBufferObject);
        const lightningSize = 3;
        const lightningType = gl.FLOAT;
        const lightningNormalize = false;
        const lightningStride = 0;
        const lightningOffset = 0;
        gl.vertexAttribPointer(
            positionAttributeLocation,
            lightningSize,
            lightningType,
            lightningNormalize,
            lightningStride,
            lightningOffset
        );

        gl.drawArrays(gl.LINE_STRIP, 0, 3);
    }
}