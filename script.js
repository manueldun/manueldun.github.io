

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
  const drawLightning = initLightning(gl,[-0.25,0.25,0],[0.25,0.4,0]);
  function update() {

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    const viewportWidth = (canvas.width / canvas.height) * 128.0;
    const viewportHeight = 128.0;
    gl.viewport(0.0, 0.0, viewportWidth, viewportHeight);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawDigits(viewportWidth, viewportHeight);

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBufferBlur);
    drawScreen(textureCanvas, viewportWidth, viewportHeight, "horizontal");

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    drawScreen(textureBlur1, viewportWidth, viewportHeight, "vertical");

    //gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    drawScreen(textureCanvas, canvas.width, canvas.height, "none");
    //gl.viewport(0.0, 0.0, canvas.width, canvas.height);
    drawDigits(canvas.width, canvas.height)
    drawLightning();
    window.requestAnimationFrame(update);
  }

  document.getElementById("pantalla-negra").style.animationPlayState = "running";
  update();

};
window.onload = animar;

