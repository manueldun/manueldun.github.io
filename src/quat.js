

function quaternionMatrix(x, y, z, angle) {
    let qx = x * Math.sin(angle / 2);
    let qy = y * Math.sin(angle / 2);
    let qz = z * Math.sin(angle / 2);
    let qw = Math.cos(angle / 2);
    const length = Math.sqrt(qx * qx + qy * qy + qz * qz + qw * qw);
    qx /= length;
    qy /= length;
    qz /= length;
    qw /= length;
  
    return new Float32Array([
      1 - 2 * (qy * qy + qz * qz), 2 * (qx * qy - qw * qz), 2 * (qx * qz + qw * qy), 0,
      2 * (qx * qy + qw * qz), 1 - 2 * (qx * qx + qz * qz), 2 * (qy * qz - qw * qx), 0,
      2 * (qx * qz - qw * qy), 2 * (qy * qz + qw * qx), 1 - 2 * (qx * qx + qy * qy), 0,
      0, 0, 0, 1
    ]);
  }