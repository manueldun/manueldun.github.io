function initLightning(gl, position1, position2) {
    const vertexShaderSource = `
    attribute vec3 a_position;
    void main()
    {
        gl_Position = vec4(a_position,1.0);
    }
    `;
    const fragmentShaderSource = `precision mediump float;
    void main()
    {
        gl_FragColor = vec4(0.5,1.0,0.5,1.0);
    }
    `;

    const program = compileShaders(
        gl,
        vertexShaderSource,
        fragmentShaderSource
    );

    let positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(positionAttributeLocation);
    const upVector = [0, 1, 0];
    const lightningDirectionZ = normalize3([
        position1[0] - position2[0],
        position1[1] - position2[1],
        position1[2] - position2[2],
    ]);
    const sideVectorX = normalize3(cross(lightningDirectionZ, upVector));
    const orthogonalVectorY = cross(sideVectorX, lightningDirectionZ);
    const angle = Math.PI / 2;
    const displacementDirection = [Math.cos(angle), Math.sin(angle), 0.0];
    const displacementDirectionOthogonal = [
        displacementDirection[0] * sideVectorX[0] +
            displacementDirection[1] * sideVectorX[1] +
            displacementDirection[2] * sideVectorX[2],
        displacementDirection[0] * orthogonalVectorY[0] +
            displacementDirection[1] * orthogonalVectorY[1] +
            displacementDirection[2] * orthogonalVectorY[2],
        displacementDirection[0] * lightningDirectionZ[0] +
            displacementDirection[1] * lightningDirectionZ[1] +
            displacementDirection[2] * lightningDirectionZ[2],
    ];
    const middlePosition = [
        (position1[0] + position2[0]) / 2.0,
        (position1[1] + position2[1]) / 2.0,
        (position1[2] + position2[2]) / 2.0,
    ];
    const displacement = 0.3;
    const displacedMiddlePosition = [
        middlePosition[0] + displacementDirectionOthogonal[0] * displacement,
        middlePosition[1] + displacementDirectionOthogonal[1] * displacement,
        middlePosition[2] + displacementDirectionOthogonal[2] * displacement,
    ];
    const steps = 4;
    const randomInfluence = 0.02;
    let bezierStepsData = [];
    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const anchorPoint1x =
            position1[0] * t + displacedMiddlePosition[0] * (1 - t);
        const anchorPoint2x =
            displacedMiddlePosition[0] * t + position2[0] * (1 - t);
        bezierStepsLocationx = anchorPoint1x * t + anchorPoint2x * (1 - t);

        const anchorPoint1y =
            position1[1] * t + displacedMiddlePosition[1] * (1 - t);
        const anchorPoint2y =
            displacedMiddlePosition[1] * t + position2[1] * (1 - t);
        bezierStepsLocationy = anchorPoint1y * t + anchorPoint2y * (1 - t);

        const anchorPoint1z =
            position1[2] * t + displacedMiddlePosition[2] * (1 - t);
        const anchorPoint2z =
            displacedMiddlePosition[2] * t + position2[2] * (1 - t);
        bezierStepsLocationz = anchorPoint1z * t + anchorPoint2z * (1 - t);

        bezierStepsData.push({
            locations: [
                bezierStepsLocationx,
                bezierStepsLocationy,
                bezierStepsLocationz,
            ],
            tangents: normalize3([
                2 *
                    t *
                    (position1[0] -
                        2 * displacedMiddlePosition[0] +
                        position2[0]) +
                    2 * (displacedMiddlePosition[0] - position2[0]),
                2 *
                    t *
                    (position1[1] -
                        2 * displacedMiddlePosition[1] +
                        position2[1]) +
                    2 * (displacedMiddlePosition[1] - position2[1]),
                2 *
                    t *
                    (position1[2] -
                        2 * displacedMiddlePosition[2] +
                        position2[2]) +
                    2 * (displacedMiddlePosition[2] - position2[2]),
            ]),
        });
    }
    const circleStep = 4;
    let circlePositions = [];
    for (let i = 0; i < circleStep; i++) {
        const anglePos = ((2 * Math.PI) / circleStep) * i;
        circlePositions.push([Math.cos(anglePos), Math.sin(anglePos), 0]);
    }

    let curvedCylinderPosition = [];
    for (const bezierStepData of bezierStepsData) {
        const orthogonalVectorCylinderSlicez = bezierStepData.tangents;
        const orthogonalVectorCylinderSlicex = normalize3(
            cross(orthogonalVectorCylinderSlicez, upVector)
        );
        const orthogonalVectorCylinderSlicey = cross(
            orthogonalVectorCylinderSlicex,
            orthogonalVectorCylinderSlicez
        );
        for (const circlePosition of circlePositions) {
            let vertexLocationx =
                circlePosition[0] * orthogonalVectorCylinderSlicex[0] +
                circlePosition[1] * orthogonalVectorCylinderSlicey[0] +
                circlePosition[2] * orthogonalVectorCylinderSlicez[0];
            let vertexLocationy =
                circlePosition[0] * orthogonalVectorCylinderSlicex[1] +
                circlePosition[1] * orthogonalVectorCylinderSlicey[1] +
                circlePosition[2] * orthogonalVectorCylinderSlicez[1];
            let vertexLocationz =
                circlePosition[0] * orthogonalVectorCylinderSlicex[2] +
                circlePosition[1] * orthogonalVectorCylinderSlicey[2] +
                circlePosition[2] * orthogonalVectorCylinderSlicez[2];

            const scale = 0.02;
            vertexLocationx *= scale;
            vertexLocationx += bezierStepData.locations[0];

            vertexLocationy *= scale;
            vertexLocationy += bezierStepData.locations[1];

            vertexLocationz *= scale;
            vertexLocationz += bezierStepData.locations[2];

            curvedCylinderPosition.push([
                vertexLocationx,
                vertexLocationy,
                vertexLocationz,
            ]);
        }
    }

    const elementBufferLength = circleStep * (steps * 2);
    const elementArray = [0];
    for (let i = 0; i < circleStep; i++) {
        console.log("strip " + (i + 1));
        if (i % 2 == 0) {
            for (let j = 1; j < 2 * (circleStep + 1); j++) {
                const indexEdgeLoop =
                    (j % 2) + Math.floor(j / 2) * circleStep + i * 2;
                elementArray.push(indexEdgeLoop);
                console.log(indexEdgeLoop);
            }
        } else {
            const baseLength = elementArray.length;
            for (let j = 0; j < 2 * circleStep; j++) {
                const indexEdgeLoop =
                    elementArray[baseLength - 1] -
                    ((j % 2) + Math.floor(j / 2) * circleStep) -
                    circleStep +
                    1;
                elementArray.push(indexEdgeLoop);
                console.log(indexEdgeLoop);
            }
        }
    }

    let lightningBufferObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lightningBufferObject);
    //gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(bezierStepsData.map(object => object.locations).flat()), gl.STATIC_DRAW);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(curvedCylinderPosition.flat()),
        gl.STATIC_DRAW
    );

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

        gl.drawArrays(gl.LINE_STRIP, 0, curvedCylinderPosition.length);
    };
}
