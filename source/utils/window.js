// Cache window variables.
function setWindowVariables() {
  var rect = getRect(canvas);
  canvasLeft = rect.left;
  canvasTop = rect.top;
  canvasWidth = rect.width;
  canvasHeight = rect.height;
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}

// Converts a coordinate from the viewport space to the SVG space.
function convertPageToSvgPoint(point) {
  return [
    ((point[0] - canvasLeft) / canvasWidth) * SVG_WIDTH,
    ((point[1] - canvasTop) / canvasHeight) * SVG_HEIGHT
  ];
}

window.addEventListener('resize', setWindowVariables);
window.addEventListener('mousedown', handleMd);
window.addEventListener('touchstart', handleMd);

function handleMd(e) {
  dragTs = e.timeStamp;
  setWindowVariables();
  var elFound = false;
  var ev;

  checkEls(e, (el, pagePoint) => {
    if (el.tagName === 'path' && !elFound) {
      if (!el.classList.contains('is-tile')) {
        ev = new CustomEvent('md', {
          detail: {
            el: el,
            pageX: pagePoint[0],
            pageY: pagePoint[1]
          }
        });
        elFound = true;

        window.dispatchEvent(ev);
      }
    }
  });
}

function checkEls(e, callback) {
  var pagePoint = getPagePoint(e);
  var els = document.elementsFromPoint(pagePoint[0], pagePoint[1]);
  for (var i = 0; i < els.length; i++) {
    callback(els[i], pagePoint);
  }
}

function getPagePoint(e) {
  var ch = e.changedTouches;

  return ch && ch[0] ? [ch[0].pageX, ch[0].pageY] : [e.pageX, e.pageY];
}