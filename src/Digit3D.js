
class Digit3D {
    constructor() {
      this.digit = Math.floor(Math.random() * Math.floor(2));
      this.position = [Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1];
      this.rotationAxis = [Math.random(), Math.random(), Math.random()];
      const length = Math.sqrt(
        this.rotationAxis[0] * this.rotationAxis[0] +
        this.rotationAxis[1] * this.rotationAxis[1] +
        this.rotationAxis[2] * this.rotationAxis[2]);
      this.rotationAxis = [
        this.rotationAxis[0] / length,
        this.rotationAxis[1] / length,
        this.rotationAxis[2] / length];
  
      this.speed = [Math.random() * 2 - 1, Math.random() * 2 - 1, 0];
      this.lastTime = Date.now();
    };
    getRotation(time) {
      return quaternionMatrix(this.rotationAxis[0], this.rotationAxis[1], this.rotationAxis[2], time * 0.002)
    }
    getPosition(time) {
      const delta = time - this.lastTime;
      this.lastTime = time;
  
      this.position[0] += this.speed[0] * delta * 0.0001;
      this.position[1] += this.speed[1] * delta * 0.0001;
      this.position[2] += this.speed[2] * delta * 0.0001;
  
      while (this.position[0] >= 1.2 && this.speed[0] > 0) {
        this.position[0] += -2.4;
      }
  
      while (this.position[0] <= -1.2 && this.speed[0] < 0) {
        this.position[0] += 2.4;
      }
  
  
      while (this.position[1] >= 1.2 && this.speed[1] > 0) {
        this.position[1] += -2.4;
      }
  
      while (this.position[1] <= -1.2 && this.speed[1] < 0) {
        this.position[1] += 2.4;
      }
  
      return this.position;
  
    }
  }