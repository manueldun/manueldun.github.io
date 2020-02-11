var Camera = {
  forwardDirection: glm.vec3(-1.0, 0.0, 0.0),
  position: glm.vec3(0.0, -10.0, 0.0),
  goForward: function (delta) {
    Camera.position = Camera.position['+'](Camera.forwardDirection['*'](delta));
  },
  goRight: function (delta) {
    var rightDirection = glm.cross(glm.vec3(0.0, 1.0, 0.0), Camera.forwardDirection.xyz);
    Camera.position = Camera.position['+'](rightDirection['*'](delta));
  },
  turnHorizontally: function (angle) {
    var rotateMatrix = glm.rotate(angle * 0.01, glm.vec3(0.0, 1.0, 0.0));
    Camera.forwardDirection = rotateMatrix['*'](glm.vec4(Camera.forwardDirection.xyz, 1.0));
    Camera.forwardDirection = glm.normalize(Camera.forwardDirection.xyz);
  },
  turnVertically: function (angle) {
    var rightDirection = glm.normalize(glm.cross(glm.vec3(0.0, 1.0, 0.0), Camera.forwardDirection.xyz));
    var rotateMatrix = glm.rotate(angle * 0.01, rightDirection);
    Camera.forwardDirection = rotateMatrix['*'](glm.vec4(Camera.forwardDirection.xyz, 1.0));
    Camera.forwardDirection = glm.normalize(Camera.forwardDirection.xyz);
  },
  getViewMatrix: function () {
    positionMatrix = glm.translate(glm.mat4(1.0), Camera.position);

    var rightDirection = glm.normalize(glm.cross(glm.vec3(0.0, 1.0, 0.0), Camera.forwardDirection.xyz));
    var normalizedUp = glm.normalize(glm.cross(Camera.forwardDirection, rightDirection.xyz));
    rotateMatrix = glm.mat4(
      glm.vec4(rightDirection.xyz, 0.0),
      glm.vec4(normalizedUp.xyz, 0.0),
      glm.vec4(Camera.forwardDirection.xyz, 0.0),
      glm.vec4(0.0, 0.0, 0.0, 1.0)
    );

    viewMatrix = glm.transpose(rotateMatrix)['*'](positionMatrix);
    return viewMatrix;
  }
};