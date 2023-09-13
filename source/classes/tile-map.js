// Pseudo class handling map info.
function TileMap(sourceTileMaps, walkPath, entities) {
  var running = false;

  initMap();

  // Creates the map arrays from the level meta data. 
  function initMap() {
    tileMapSpaces = getBlankMap();
    tileMapItems = getBlankMap();
    tileMapLose = getBlankMap(true);

    applyTileMap();
    applyTileMap(true);

    renderTileMap();
  }

  // Applies the items to the maps. Rooks must be applied second due to blocking.
  function applyTileMap(rooks) {
    if (rooks) {
      applyRooks(0);
    } else {
      applyFirstTileMap(0);
    }

    for (const entityName in entities) {
      if (Object.hasOwn(entities, entityName)) {
        var entity = entities[entityName];

        if (entity.entityMeta && entity.entityMeta.s && entity.entityMeta.stm) {
          if (entity.state && entity.state.rf !== undefined) {
            if (rooks) {
              applyRooks(entity.entityMeta.stm[entity.entityMeta.s.indexOf(entity.state.rf)]);
            } else {
              applyFirstTileMap(entity.entityMeta.stm[entity.entityMeta.s.indexOf(entity.state.rf)]);
            }
          }
        }
      }
    }
  }

  // Apply tile map elements (not rooks).
  function applyFirstTileMap(index) {
    var sourceTileMap = sourceTileMaps[index];
    var i;

    for (i = 0; i < sourceTileMap.s.length; i += 2) {
      tileMapSpaces[sourceTileMap.s[i]][sourceTileMap.s[i + 1]] = 1;
    }

    for (i = 0; i < sourceTileMap.i.length; i += 3) {
      var tMapX = sourceTileMap.i[i + 1];
      var tMapY = sourceTileMap.i[i + 2];

      tileMapItems[tMapX][tMapY] = {
        i: sourceTileMap.i[i]
      };

      for (var ti = -1; ti <= 1; ti += 2) {
        for (var tj = -1; tj <= 1; tj += 2) {

          if (sourceTileMap.i[i] === 'p') {
            var curTile = getTileInMap(tMapX + ti, tMapY + tj, tileMapLose);

            if (curTile !== undefined && curTile.push !== undefined) {
              curTile.push(sourceTileMap.i[i]);
            }
          }

          if (sourceTileMap.i[i] === 'b') {
            var curTile = getTileInMap(tMapX + ti * 2, tMapY + tj * 2, tileMapLose);

            if (curTile !== undefined && curTile.push !== undefined) {
              curTile.push(sourceTileMap.i[i]);
            }
          }
        }
      }
    }
  }

  // Apply tile map items (rooks)
  function applyRooks(index) {
    var sourceTileMap = sourceTileMaps[index];
    var i;

    for (i = 0; i < sourceTileMap.i.length; i += 3) {
      var tMapX = sourceTileMap.i[i + 1];
      var tMapY = sourceTileMap.i[i + 2];

      if (sourceTileMap.i[i] === 'r') {
        var xLeftStopped = false;
        var xRightStopped = false;
        var yUpStopped = false;
        var yDownStopped = false;

        for (var ti = 1; ti <= 20; ti += 1) {
          var xLeftLoseTile = getTileInMap(tMapX - ti, tMapY, tileMapLose);
          var xRightLoseTile = getTileInMap(tMapX + ti, tMapY, tileMapLose);
          var yUpLoseTile = getTileInMap(tMapX, tMapY - ti, tileMapLose);
          var yDownLoseTile = getTileInMap(tMapX, tMapY + ti, tileMapLose);
          var xLeftItemTile = getTileInMap(tMapX - ti, tMapY, tileMapItems);
          var xRightItemTile = getTileInMap(tMapX + ti, tMapY, tileMapItems);
          var yUpItemTile = getTileInMap(tMapX, tMapY - ti, tileMapItems);
          var yDownItemTile = getTileInMap(tMapX, tMapY + ti, tileMapItems);

          if (xLeftLoseTile !== undefined && xLeftItemTile !== 0) {
            xLeftStopped = true;
          }

          if (xRightLoseTile !== undefined && xRightItemTile !== 0) {
            xRightStopped = true;
          }

          if (yUpLoseTile !== undefined && yUpItemTile !== 0) {
            yUpStopped = true;
          }

          if (yDownLoseTile !== undefined && yDownItemTile !== 0) {
            yDownStopped = true;
          }

          if (!xLeftStopped && xLeftLoseTile !== undefined) {
            xLeftLoseTile.push(sourceTileMap.i[i]);
          }

          if (!xRightStopped && xRightLoseTile !== undefined) {
            xRightLoseTile.push(sourceTileMap.i[i]);
          }

          if (!yUpStopped && yUpLoseTile !== undefined) {
            yUpLoseTile.push(sourceTileMap.i[i]);
          }

          if (!yDownStopped && yDownLoseTile !== undefined) {
            yDownLoseTile.push(sourceTileMap.i[i]);
          }
        }
      }
    }
  }

  // Shorthand to get tile in map at coordinate.
  function getTileInMap(x, y, mp) {
    return mp[x] !== undefined && mp[x][y] !== undefined ? mp[x][y] : undefined;
  }

  // Render the map as SVG, projected isometrically.
  function renderTileMap() {
    var pathHtml = '';
    var d;

    tileMapSpaces.forEach((row, i) => {
      tileMapSpaces[i].forEach((col, j) => {
        if (col === 1) {
          var x1 = i ;
          var x2 = (i + 1) ;
          var x3 = (i + 1) ;
          var x4 = i ;
          var y1 = (j ) - x1;
          var y2 = (j ) - x2;
          var y3 = ((j + 1) )  - x3;
          var y4 = ((j + 1) )  - x4;
          x1 += (j  ) + 1;
          x2 += (j  ) + 1;
          x3 += ((j + 1) ) + 1 ;
          x4 += ((j + 1) ) + 1 ;

  
          d = `${x1 * ADJ - REL_WIDTH / 2},${y1 * OPP + REL_HEIGHT / 2} L ${x2 * ADJ - REL_WIDTH / 2},${y2 * OPP + REL_HEIGHT / 2} ${x3 * ADJ - REL_WIDTH / 2},${y3 * OPP + REL_HEIGHT / 2} ${x4 * ADJ - REL_WIDTH / 2},${y4 * OPP + REL_HEIGHT / 2} `;
          pathHtml += pathTemplate('#000', 'none', 0, d, i * 18 + j, 1, true);
        }
      });
    });

    tilesDiv.innerHTML = svgTemplate('', pathHtml);
    removeListeners();
    bodyEl.addEventListener('click', handleClick);
  }

  // Click event, makes Merlin walk.
  function handleClick(e) {
    if (running && (e.timeStamp || 0) - (dragTs || 0) < 200) {
      checkEls(e, el => {
        var pathPoint = getPathPoint(el);
  
        if (pathPoint) {
          walkPath(pathPoint[0], pathPoint[1]);
        }
      });
    }
  }

  // Show losing tiles at end of game.
  function highlightLose() {
    var tilePaths = tilesDiv.querySelectorAll('path');

    for (var i = 0; i < tilePaths.length; i++) {
      var pathPoint = getPathPoint(tilePaths[i]);
      var curTile = tileMapLose[pathPoint[0]][pathPoint[1]];

      if (curTile.length) {
        tilePaths[i].classList.add('l');
      }
    }
  }

  // Convert index to x y coordinate.
  function getPathPoint(path) {
    var dataIndex = path.getAttribute('data-index');

    if (dataIndex === null) {
      return;
    }

    var index = parseInt(dataIndex);

    return [x = M.floor(index / 18), index % 18];
  }

  // Remove listeners to avoid memory leaks.
  function removeListeners() {
    bodyEl.removeEventListener('click', handleClick);
  }

  // Creates a blank map.
  function getBlankMap(makeArray) {
    var tileMap = [];

    for (var i = 0; i < 19; i++) {
      tileMap[i] = [];

      for (var j = 0; j < 19; j++) {
        tileMap[i][j] = makeArray ? [] : 0;
      }
    }

    return tileMap;
  }

  return {
    initMap: initMap,
    ri: removeListeners,
    hl: highlightLose,
    st: () => running = true
  };
}