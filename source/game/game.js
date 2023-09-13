var level;
var levelNames = ['bridge', 'courtyard', 'cellar', 'garrison', 'hall', 'chapel', 'throne'];
var currentLevel = 0;

setWindowVariables();

// Progress to next level in array.
function nextLevel() {
  if (currentLevel < levelNames.length) {
    startLevel(levelNames[currentLevel++]);
  } else {
    showModal(
      'Well played, Wise One.',
      () => window.location.reload()
    );
  }
}

// Starts the level.
function startLevel(levelName, lost) {
  level = Level(levelName, lost);
  requestAnimationFrame(tickLevel);
}

// Renders level and manages updates. Main animation loop.
function tickLevel(timeStamp) {
  if (level) {
    level.tick(timeStamp);
  }

  requestAnimationFrame(tickLevel);
}

// The first modal of the game.
showModal(
  'Merlin, your legend has reached Castile. Let us play: "Ajedrez".<br/><br/>King Alfonso X',
  () => {
    var dur = 1500;

    if (bodyEl.requestFullscreen) {
      bodyEl.requestFullscreen({navigationUI:'hide'});
    } else if (bodyEl.mozRequestFullScreen) {
      bodyEl.mozRequestFullScreen({navigationUI:'hide'});
    } else if (bodyEl.webkitRequestFullscreen) {
      bodyEl.webkitRequestFullscreen({navigationUI:'hide'});
    }

    if (!songStarted) {
      setTimeout(() => start(), 1500);
      dur = 3000;
    }

    setTimeout(() => nextLevel(), dur);
  } 
);
