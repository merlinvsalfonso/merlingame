// Pseudo class handling level.
function Level(levelName, lost) {
  levelDiv.innerHTML = '';
  var sourceLevel = sourceLevels[levelName];
  var levelMeta = levelMetas[levelName];
  var tileMap;
  var wizard;
  var entities = {};
  var levelRunning = false;
  var levelEnded = false;
  var framePromises = [];

  cloneObject(sourceLevel).forEach(sEntRef => {
    entities[sEntRef[0]] = Entity(
      sourceEntities[sEntRef[0]],
      false,
      sEntRef[1],
      sEntRef[2],
      sEntRef[0].indexOf('3d') !== -1,
      levelMeta[sEntRef[0]] ? cloneObject(levelMeta[sEntRef[0]]) : {},
      updateSnap
    );

    framePromises = framePromises.concat(entities[sEntRef[0]].fs.map(f => f.pr));
  });

  // Don't render until all images loaded.
  Promise.all(framePromises).then(() => {
    var delay = 0;
    canvas.classList.remove('i');
    wizard = Character(entities.wiu, entities.wid, updateInteractivity);
    tileMap = TileMap(levelMetas[levelName].tm, wizard.walkPath, entities);
  
    if (levelMeta.tx && !lost) {
      delay = 1500;
      tick(0, true);
      showModal(levelMeta.tx, () => {
        levelRunning = true;
        setTimeout(tileMap.st, 600);
      });
    } else {
      levelRunning = true;
      setTimeout(tileMap.st, 600);
    }

    setTimeout(() => canvas.classList.remove('h'), delay);
  });

  // Render and do updates.
  function tick(timeStamp, forceRender) {
    if (levelRunning) {
      wizard.tick(timeStamp);
    }
    
    if (levelRunning || forceRender) {
      for (const entityName in entities) {
        if (Object.hasOwn(entities, entityName)) {
          entities[entityName].render(timeStamp);
          
          if (levelEnded) {
            entities[entityName] = null;
          }
        }
      }
    }
  }

  // Unbind events to avoid memory leaks. If user lost show losing tiles.
  function endLevel(lost) {
    levelRunning = false;
    levelEnded = true;

    for (const entityName in entities) {
      if (Object.hasOwn(entities, entityName)) {
        entities[entityName].removeInteractivity();
      }
    }

    tileMap.ri();

    if (lost) {
      canvas.classList.add('i');
      tileMap.hl();
      setTimeout(() => {
        canvas.classList.add('h');
        setTimeout(() => showModal(lt[lost[2][0]], () => startLevel(levelNames[currentLevel - 1], lost)), 1000);
      }, 1000);
    } else {
      canvas.classList.add('h');
      setTimeout(nextLevel, 1000);
    }
  }

  // Update map if user snaps.
  function updateSnap() {
    tileMap.initMap();
    wizard.checkLose();
  }

  // Don't let user move object if Merlin is standing on it.
  function updateInteractivity(point) {
    for (const entityName in entities) {
      if (Object.hasOwn(entities, entityName)) {
        var entity = entities[entityName];

        if (entity.entityMeta && entity.entityMeta.i && entity.entityMeta.stm) {
          var prevent = false;

          entity.entityMeta.stm.forEach(tmIndex => {
            var tileMapArr = levelMetas[levelName].tm[tmIndex];
          
            for (i = 0; i < tileMapArr.s.length; i += 2) {
              if (point[0] === tileMapArr.s[i] && point[1] === tileMapArr.s[i + 1]) {
                prevent = true;
              }
            }
          });

          entity.entityMeta.pr = !!prevent;
        }
      }
    }
  }

  return {
    tick: tick,
    endLevel: endLevel,
    levelIsRunning: () => levelRunning
  };
}