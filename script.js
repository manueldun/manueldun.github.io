

async function animar() {
  const canvas = document.getElementById("animation");
  const gl = canvas.getContext("webgl");
  if (!gl) {
    return;
  }

  gl.enable(gl.DEPTH_TEST);
  canvas.width = canvas.clientWidth;
  canvas.height = canvas.clientHeight;
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  gl.clearColor(0.004, 0.055, 0, 1);
  const drawDigits = await initDigits(gl, canvas);
  const drawScreen = drawToScreenInit(gl);
  const textureCanvas = createCanvasTexture(gl, canvas);
  const frameBuffer = createFramebuffer(gl, canvas, textureCanvas);
  const textureBlur1 = createCanvasTexture(gl, canvas);
  const frameBufferBlur = createFramebuffer(gl, canvas, textureBlur1);
  function update() {
/*
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    const viewportWidth = 512.0;
    const viewportHeight = (canvas.width / canvas.height) * 512.0;
    gl.viewport(0.0, 0.0, viewportWidth, viewportHeight);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawDigits(viewportWidth, viewportHeight);

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBufferBlur);

    drawScreen(textureCanvas, viewportWidth, viewportHeight, "horizontal");

*/

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    const viewportWidth2 = canvas.width;
    const viewportHeight2 = canvas.height;
    //drawScreen(textureBlur1, viewportWidth2, viewportHeight2, canvas, "none");
    gl.viewport(0.0, 0.0, viewportWidth2, viewportHeight2);
    drawDigits(viewportHeight2, viewportWidth2)

    window.requestAnimationFrame(update);
  }

  document.getElementById("pantalla-negra").style.animationPlayState = "running";
  update();

};
window.onload = animar;

