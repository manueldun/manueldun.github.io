

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

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    drawDigits();
    
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBufferBlur);
    
    drawScreen(textureCanvas, canvas,true);

    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuffer);

    drawScreen(textureBlur1 , canvas, false);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);

    drawScreen(textureCanvas , canvas);
    drawDigits();
    window.requestAnimationFrame(update);
  }

  document.getElementById("pantalla-negra").style.animationPlayState = "running";
  update();

};
window.onload = animar;

