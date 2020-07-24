// initialize input logic, returns functions to be executed per frame
function initInputLogic(Camera,canvas) {
    var keyW = false;
    var keyS = false;
    var keyA = false;
    var keyD = false;
  
    window.addEventListener('keydown',
      function moveForward(e) {
        switch (e.code) {
          case 'KeyW':
            keyW = true;
            break;
          case 'KeyS':
            keyS = true;
            break;
          case 'KeyA':
            keyA = true;
            break;
          case 'KeyD':
            keyD = true;
            break;
          default:
        }
      });
  
      window.addEventListener('keyup',
      function moveForward(e) {
        switch (e.code) {
          case 'KeyW':
            keyW = false;
            break;
          case 'KeyS':
            keyS = false;
            break;
          case 'KeyA':
            keyA = false;
            break;
          case 'KeyD':
            keyD = false;
            break;
          default:
        }
      });
  
    var mouseDownX = 0.0;
    var mouseDownY = 0.0;
    clickedMouseButton = false;
  
    canvas.addEventListener('mousedown', function (e) {
      if (typeof e === 'object') {
        switch (e.button) {
          case 0:
            clickedMouseButton = true;
            mouseDownX = e.clientX;
            mouseDownY = e.clientY;
            break;
        }
      }
    });
  
    canvas.addEventListener('mouseup', function (e) {
      if (typeof e === 'object') {
        switch (e.button) {
          case 0:
            clickedMouseButton = false;
            break;
        }
      }
    });
  
    canvas.addEventListener('mousemove', mouseButtonUp);
    function mouseButtonUp(e) {
      if (clickedMouseButton === true) {
        Camera.turnHorizontally(mouseDownX - e.clientX);
        mouseDownX = e.clientX;
        Camera.turnVertically(mouseDownY - e.clientY);
        mouseDownY = e.clientY;
      }
    }
    return function inputLogic(delta) {
      if (keyW === true) {
        Camera.goForward(delta * 0.01);
      }
      if (keyS === true) {
        Camera.goForward(-delta * 0.01);
      }
      if (keyD === true) {
        Camera.goRight(-delta * 0.01);
      }
      if (keyA === true) {
        Camera.goRight(delta * 0.01);
      }
    };
  }