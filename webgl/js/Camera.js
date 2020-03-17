var Camera = {
  forwardDirection: glMatrix.vec3.fromValues(-1, 0, 0),
  position: glMatrix.vec3.fromValues(10, -5, 0),
  goForward: function (delta) {
    var displacement = glMatrix.vec3.create();
    glMatrix.vec3.mul(displacement, Camera.forwardDirection, [delta, delta, delta]);
    glMatrix.vec3.add(Camera.position, Camera.position, displacement);
  },
  goRight: function (delta) {
    var rightDirection = glMatrix.vec3.create();
    var normalizedRightDirection = glMatrix.vec3.create();
    var displacement = glMatrix.vec3.create();
    glMatrix.vec3.cross(rightDirection, [0, 1, 0], Camera.forwardDirection);
    glMatrix.vec3.normalize(normalizedRightDirection, rightDirection);
    glMatrix.vec3.mul(displacement, normalizedRightDirection, [delta, delta, delta]);
    glMatrix.vec3.add(Camera.position, Camera.position, displacement);
  },
  turnHorizontally: function (angle) {

    var rotationMatrix = glMatrix.mat4.create();
    glMatrix.mat4.fromRotation(rotationMatrix, angle * 0.01, [0, 1, 0]);

    var cameraDirectionVec4 = glMatrix.vec4.fromValues(Camera.forwardDirection[0], Camera.forwardDirection[1], Camera.forwardDirection[2], 1);
    glMatrix.vec4.transformMat4(cameraDirectionVec4, cameraDirectionVec4, rotationMatrix);
    Camera.forwardDirection = glMatrix.vec3.fromValues(cameraDirectionVec4[0], cameraDirectionVec4[1], cameraDirectionVec4[2]);

  },
  turnVertically: function (angle) {

    var rightDirection = glMatrix.vec3.create();
    glMatrix.vec3.cross(rightDirection, [0, 1, 0], Camera.forwardDirection);
    glMatrix.vec3.normalize(rightDirection, rightDirection);

    var rotationMatrix = glMatrix.mat4.create();
    glMatrix.mat4.rotate(rotationMatrix, rotationMatrix, angle * 0.01, rightDirection);

    var cameraDirectionVec4 = glMatrix.vec4.fromValues(
      Camera.forwardDirection[0], Camera.forwardDirection[1], Camera.forwardDirection[2], 1.0);

    glMatrix.vec4.transformMat4(cameraDirectionVec4, cameraDirectionVec4, rotationMatrix);

    Camera.forwardDirection = glMatrix.vec3.fromValues(
      cameraDirectionVec4[0], cameraDirectionVec4[1], cameraDirectionVec4[2])

  },
  getViewMatrix: function () {

    var rightDirection = glMatrix.vec3.create();
    glMatrix.vec3.cross(rightDirection, [0, 1, 0], Camera.forwardDirection);
    glMatrix.vec3.normalize(rightDirection, rightDirection);

    var upDirection = glMatrix.vec3.create();
    glMatrix.vec3.cross(upDirection, Camera.forwardDirection, rightDirection);
    glMatrix.vec3.normalize(upDirection, upDirection);

    var translateMatrix = glMatrix.mat4.create();
    glMatrix.mat4.translate(translateMatrix, translateMatrix, Camera.position);

    var rotationMatrix = glMatrix.mat4.fromValues(
      rightDirection[0], rightDirection[1], rightDirection[2], 0,
      upDirection[0], upDirection[1], upDirection[2], 0,
      Camera.forwardDirection[0], Camera.forwardDirection[1], Camera.forwardDirection[2], 0,
      0, 0, 0, 1
    );
    glMatrix.mat4.transpose(rotationMatrix, rotationMatrix);

    var viewMatrix = glMatrix.mat4.create();
    glMatrix.mat4.mul(viewMatrix, rotationMatrix, translateMatrix);

    return viewMatrix;
  }
};