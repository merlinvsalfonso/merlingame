// Pseudo class for character (merlin).
function Character(entity, downEntity, updateInteractivity) {
  var pathToWalk = null;
  var nextPathToWalk = null;
  var currentTilePathIndex;
  var pathStartTimeStamp;
  var stepDuration = 300;
  var meta = entity.entityMeta;

  moveCharacterSprite(meta.tx, meta.ty, meta.tx, meta.ty, 1);

  // Animate (usually as walking). Update game when reaches a tile.
  function tick(timeStamp) {
    if (pathToWalk !== null && pathStartTimeStamp) {
      var ratio = M.min((timeStamp - pathStartTimeStamp) / stepDuration, 1);
      var lastTile = pathToWalk[currentTilePathIndex];
      var nextTile = pathToWalk[currentTilePathIndex + 1];
      moveCharacterSprite(lastTile[0], lastTile[1], nextTile[0], nextTile[1], ratio);

      if (ratio >= 1) {
        pathStartTimeStamp = timeStamp;

        if (tileMapItems[meta.tx] && tileMapItems[meta.tx][meta.ty] && tileMapItems[meta.tx][meta.ty].i === 'e') {
          level.endLevel();
        }

        checkLose();

        if (nextPathToWalk === null && pathToWalk[currentTilePathIndex + 2] !== undefined && tileIsClear(pathToWalk[currentTilePathIndex + 2])) {
          currentTilePathIndex++;
          meta.tx = pathToWalk[currentTilePathIndex + 1][0];
          meta.ty = pathToWalk[currentTilePathIndex + 1][1];
          updateInteractivity([meta.tx, meta.ty]);
        } else {
          pathToWalk = null;
        }
      }
    }

    if (pathToWalk === null && nextPathToWalk !== null) {
      pathStartTimeStamp = timeStamp;
      pathToWalk = nextPathToWalk;
      nextPathToWalk = null;
      currentTilePathIndex = 0;

      if (pathToWalk[currentTilePathIndex + 1] !== undefined && tileIsClear(pathToWalk[currentTilePathIndex + 1])) {
        meta.tx = pathToWalk[currentTilePathIndex + 1][0];
        meta.ty = pathToWalk[currentTilePathIndex + 1][1];
        updateInteractivity([meta.tx, meta.ty]);
      }
    }
  }

  // Interpolates the sprite between 2 points.
  function moveCharacterSprite(x1, y1, x2, y2, ratio) {
    var x = x1 * (1 - ratio) + x2 * ratio;
    var y = y1 * (1 - ratio) + y2 * ratio;
    var dMeta;

    meta.cx = (x + y + 1) * ADJ - REL_WIDTH / 2 - 4;
    meta.cy = (y - x) * OPP + REL_HEIGHT / 2 - 190 - sin(ratio * M.PI * 2) * 3;

    if (downEntity) {
      dMeta = downEntity.entityMeta;
      dMeta.cx = (x + y + 1) * ADJ - REL_WIDTH / 2 - 4;
      dMeta.cy = (y - x) * OPP + REL_HEIGHT / 2 - 190 - sin(ratio * M.PI * 2) * 3;
      meta.h = true;
      dMeta.h = true;
      meta.f = false;
      dMeta.f = false;

      if (x1 - x2 > 0) {
        dMeta.h = false;
        dMeta.f = false;
      } else if (y1 - y2 > 0) {
        meta.h = false;
        meta.f = false;
      } else if (y1 - y2 < 0) {
        dMeta.h = false;
        dMeta.f = true;
      } else {
        meta.h = false;
        meta.f = true;
      }
    }
  }

  // A* path finding.
  function walkPath(x, y) {
    var nextPath = aStar([meta.tx, meta.ty], [x, y]);

    if (nextPath.length > 1) {
      nextPathToWalk = nextPath;
    }
  }

  // Check tile is clear.
  function tileIsClear(tile) {
    return tileMapSpaces[tile[0]][tile[1]] === 1;
  }

  // Check if user lost on current tile.
  function checkLose() {
    if (tileMapLose[meta.tx] && tileMapLose[meta.tx][meta.ty] && tileMapLose[meta.tx][meta.ty].length) {
      level.endLevel([meta.tx, meta.ty, tileMapLose[meta.tx][meta.ty]]);
    }
  }

  return {
    walkPath: walkPath,
    tick: tick,
    checkLose: checkLose
  };
}