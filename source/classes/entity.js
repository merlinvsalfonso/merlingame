var gradientCounter = 0;

// Pseudo class for entity. An entity is any visual object in the game, 2d or 3d.
function Entity(sourceEntity, computePaths, x, y, is3d, entityMeta, updateSnap) {
  var sourcePaths = getSourcePaths(sourceEntity);
  var interactiveSourcePaths;
  var interactiveSvgContainer;
  var tp;
  var svgTp;
  var frames = [];
  var state = { f: entityMeta.defaultF || 0, rf: entityMeta.defaultF || 0 };
  var lastF;
  var lastRf;
  var tf;
  var lastTimeStamp;

  if (computePaths) {
    return sourcePaths;
  }

  addInteractivity();

  if (entityMeta.r && is3d) {
    cacheRotatingFrames(entityMeta.r);
  } else if (entityMeta.m) {
    cacheMovingFrames(entityMeta.m);
  } else {
    cacheFrame();
  }

  // Returns an array of paths and conditionally applies transformations to path points.
  function getSourcePaths(sourceEntity) {
    var sourcePaths = [];

    cloneObject(sourceEntity).forEach(item => {
      if (Array.isArray(item)) {
        Entity(sourceEntities[item[0]], true, item[1], item[2], false, {})
          .forEach(sPath => sourcePaths.push(sPath));
      } else {
        if (computePaths) {
          item.d = item.d.map(point => point.map((v, i) => {
            return i % 2 === 0 ? v - (x || 0) : v - (y || 0);
          }));
        }

        sourcePaths.push(item);
      }
    });

    return sourcePaths;
  }

  // Allow user to manipulate objects
  function addInteractivity() {
    if (entityMeta.i) {
      interactiveSourcePaths = getSourcePaths(sourceEntities[entityMeta.i]);
      interactiveSvgContainer = document.createElement('div');
      levelDiv.append(interactiveSvgContainer);

      window.addEventListener('md', handleMouseDown);
      window.addEventListener('touchmove', handleMouseMove, { passive: false });
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchend', handleMouseUp);
    }
  }

  // Mousedown event.
  function handleMouseDown(e) {
    if (e.detail.el.tagName === 'path' && interactiveSvgContainer.contains(e.detail.el) && !entityMeta.pr) {
      svgTp = convertPageToSvgPoint([e.detail.pageX, e.detail.pageY]);
      tf = state.f;
      bodyEl.classList.add('dragging');

      if (is3d) {
        tp = getTPoint3d(frames[state.f].iPaths[e.detail.el.getAttribute('data-index')], svgTp);
      }
    }
  }

  // Mouse move event.
  function handleMouseMove(e) {
    e.preventDefault();
    if (svgTp) {
      var newSvgTp = convertPageToSvgPoint(getPagePoint(e));
      if (is3d) {
        state.f = getNewF3d(newSvgTp);
      } else {
        state.f = getNewF(newSvgTp);
      }
    }
  }

  // Mouse up event.
  function handleMouseUp(e) {
    tp = null;
    svgTp = null;
    bodyEl.classList.remove('dragging');
  }

  // Remove event listener to avoid memory leaks.
  function removeInteractivity() {
    window.removeEventListener('md', handleMouseDown);
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('touchmove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    window.removeEventListener('touchend', handleMouseUp);
  }

  // Convert touched point into 3d point. Project 2d to 3d based on normal of face clicked.
  function getTPoint3d(iPath, svgTp) {
    var dt = iPath.dt;
    var v3 = getCrossProduct(dt[0], dt[1], dt[2]);
    var x = (svgTp[0] - (entityMeta.x || 0) * ADJ) / (SQRT_2 * ADJ);
    var y = (svgTp[1] - (entityMeta.y || 0) * OPP) / (SQRT_2 * ADJ);
    var z = (v3[0] * dt[0][0] + v3[1] * dt[0][1] + v3[2] * dt[0][2] - v3[1] * y - v3[0] * x) / v3[2];
    tp = rotateD([[x, y, z]], M.acos(PROJECTION_ANGLE), 0, 0);

    return rotateD(tp, 0, 0, -PI / 4)[0];
  }

  function getNewF3d(newSvgTp) {
    var dv = [newSvgTp[0] - svgTp[0], newSvgTp[1] - svgTp[1]];
    var newTp;
    var newTpAng;
    var tpAng;
    var rLower = entityMeta.r[1][0];
    var rUpper = entityMeta.r[1][1];
    var newF;
    var finalAng;

    if (entityMeta.r[0] === 'x') {
      newTp = [tp[0], tp[1] - dv[0] / ADJ, tp[2] - dv[1] / OPP / 2 - dv[0] / ADJ / 2];
      tpAng = normalizeAngle(M.atan2(tp[1], tp[2]));
      newTpAng = normalizeAngle(M.atan2(newTp[1], newTp[2]));
    } else if (entityMeta.r[0] === 'y') {
      newTp = [tp[0] + dv[0] / ADJ, tp[1], tp[2] - dv[1] / OPP / 2 + dv[0] / ADJ / 2];
      tpAng = normalizeAngle(M.atan2(tp[0], tp[2]));
      newTpAng = normalizeAngle(M.atan2(newTp[0], newTp[2]));
    } else if (entityMeta.r[0] === 'z') {
      newTp = [tp[0] + (dv[0] / ADJ / 2) + (dv[1] / OPP / 2), tp[1] - (dv[0] / ADJ / 2) + (dv[1] / OPP / 2), tp[2]];
      tpAng = normalizeAngle(M.atan2(tp[1], tp[0]));
      newTpAng = normalizeAngle(M.atan2(newTp[1], newTp[0]));
    }

    finalAng = normalizeAngle(angDiff(newTpAng, tpAng) + convertToRadians(tf));

    if (finalAng > rUpper || finalAng < rLower) {
      if (M.abs(angDiff(finalAng, rUpper)) < M.abs(angDiff(finalAng, rLower))) {
        finalAng = rUpper;
      } else {
        finalAng = rLower;
      }
    }

    newF = bound(M.floor(convertToDegrees(finalAng)), entityMeta.r[2] - 1, 0);

    return newF;
  }

  // Picks the frame based on how the entity should appear.
  function getNewF(newSvgTp) {
    var diffX = M.floor((svgTp[0] - newSvgTp[0]) / 10);
    var diffY = M.floor((svgTp[1] - newSvgTp[1]) / 10);

    if (entityMeta.m[0] === 'x') {
      return bound(tf - M.round(diffX / 2 + diffY / 2), entityMeta.m[2] - 1, 0);
    } else if (entityMeta.m[0] === 'y') {
      return bound(tf - M.round(- diffX / 2 + diffY / 2), entityMeta.m[2] - 1, 0);
    } else if (entityMeta.m[0] === 'z') {
      return bound(tf - diffY, entityMeta.m[2] - 1, 0);
    }
  }

  // Cache the animated frames rather than re-rendering each frame.
  function cacheRotatingFrames() {
    var i;
    var rotate;

    for (i = 0; i < entityMeta.r[2]; i++) {
      rotate = ((entityMeta.r[1][1] - entityMeta.r[1][0]) / (entityMeta.r[2] - 1)) * i;

      cacheFrame(
        [
          entityMeta.r[0] === 'x' ? rotate : 0,
          entityMeta.r[0] === 'y' ? rotate : 0,
          entityMeta.r[0] === 'z' ? rotate : 0
        ]
      );
    }
  }

  // This caches objects that move (don't rotate)
  function cacheMovingFrames() {
    var i;
    var movement;

    for (i = 0; i < entityMeta.m[2]; i++) {
      movement = ((entityMeta.m[1][1] - entityMeta.m[1][0]) / (entityMeta.m[2] - 1)) * i;

      cacheFrame(
        null,
        [
          entityMeta.m[0] === 'x' ? movement : 0,
          entityMeta.m[0] === 'y' ? movement : 0,
          entityMeta.m[0] === 'z' ? movement : 0
        ]
      );
    }
  }

  // Caches the image data of the current entity.
  function cacheFrame(rMatrix, mMatrix) {
    var frame = loadFrame(rMatrix, mMatrix);

    if (entityMeta.i) {
      frame.iPaths = createFramePaths(interactiveSourcePaths, rMatrix, mMatrix);
      frame.iSvg = getSvg(frame.iPaths);
    }

    if (entityMeta.canFlip) {
      frame.ff = loadFrame(rMatrix, mMatrix, true);
    }

    frames.push(frame);
  }

  // Converts SVG markup to an image that can go on the canvas.
  function loadFrame(rMatrix, mMatrix, flipped) {
    var frame = {
      img: new Image(),
      paths: createFramePaths(sourcePaths, rMatrix, mMatrix)
    };

    frame.svg = getSvg(frame.paths, flipped);
    frame.pr = new Promise(resolve => frame.img.onload = resolve);
    frame.img.src = URL.createObjectURL(new Blob([frame.svg], {
      type: 'image/svg+xml;charset=utf-8'
    }));

    return frame;
  }

  // Creates the paths for the given frame.
  function createFramePaths(sourcePaths, rMatrix, mMatrix) {
    var paths = cloneObject(sourcePaths);
    
    paths.forEach(path => {
      path.df = path.d.map(point => point.map((v, i) => {
        if (mMatrix) {
          if (i % 2 === 0) {
            v += mMatrix[0];
            v -= mMatrix[1];
          }

          if (i % 2 === 1) {
            v += mMatrix[0];
            v += mMatrix[1];
            v += mMatrix[2] * 2;
          }
        }

        return i % 2 === 0 ? v * ADJ : v * OPP;
      }));

      if (is3d) {
        if (rMatrix) {
          path.d = rotateD(path.d, rMatrix[0], rMatrix[1], rMatrix[2]);
        }

        path.dt = rotateD(path.d, 0, 0, PI / 4);
        path.dt = rotateD(path.dt, -M.acos(PROJECTION_ANGLE), 0, 0);
        path.z = path.dt.reduce((total, point) => total + point[2], 0) / path.dt.length;
        path.df = path.dt.map(point => 
          point.map(v => v * SQRT_2 * ADJ).filter((v, i) => i % 3 !== 2)
        );
      }
    });

    if (is3d && !entityMeta.ds) {
      paths.sort((a, b) => a.z - b.z);
    }

    return paths;
  }

  // Builds the SVG at a given frame.
  function getSvg(paths, flipped) {
    var defHtml = '';
    var pathHtml = '';

    paths.forEach((path, i) => {
      var fill = path.f === undefined ? 'none' : '#' + colorTokens[path.f];
      var stroke = path.s === undefined || colorTokens[path.s] === 'none' ? undefined : '#' + colorTokens[path.s];

      var d = path.df.map((point, i) => {
        return (point.length === 6 ? 'C ' : i !== 0 ? 'L ' : '') + point.map((v, i) => {
          if (i % 2 === 0) {
            return (v + (entityMeta.x || 0) * ADJ) + ',';
          } else {
            return (v + (entityMeta.y || 0) * OPP) + ' ';
          }
        }).join('');
      }).join(' ');

      if (path.g) {
        var gId = `g-${path.g[0]}-${gradientCounter++}`;
        
        defHtml += gradientTemplate(
          gId,
          path.g[1] * ADJ, // TODO: This should be a method. Or computed with others
          path.g[2] * OPP,
          colorTokens[sourceGradients[path.g[0]][0]],
          path.g[3] * ADJ,
          path.g[4] * OPP,
          colorTokens[sourceGradients[path.g[0]][1]]
        );

        fill = `url('#${gId}')`;
      }

      pathHtml += pathTemplate(fill, stroke, path.w, d, i, path.z !== 0);
    });

    return svgTemplate(defHtml, pathHtml, flipped);
  }

  // Render the paths contained within this entity.
  function render(timeStamp) {
    var timeStampDiff = lastTimeStamp ? timeStamp - lastTimeStamp : 0;
    var snapObj;

    if (!entityMeta.h) {
      if (entityMeta.f) {
        ctx.drawImage(frames[state.f].ff.img,  (entityMeta.cx || 0) -REL_WIDTH + 200, entityMeta.cy || 0);
      } else {
        ctx.drawImage(frames[state.f].img, entityMeta.cx || 0, entityMeta.cy || 0);
      }
  
      if (entityMeta.i) {
        if (svgTp === null && entityMeta.s) {
          snapObj = snap(state.f, entityMeta, timeStampDiff);

          if (entityMeta.s.indexOf(state.f) === -1) {
            state.f = snapObj.upd;
          } else {
            state.rf = snapObj.val;
          }
        }

        if (lastRf !== state.rf && entityMeta.s && entityMeta.s.indexOf(state.rf) !== -1) {
          lastRf = state.rf;

          if (updateSnap) {
            updateSnap();
          }
        }

        if (lastF !== state.f) {
          lastF = state.f;
          interactiveSvgContainer.innerHTML = frames[state.f].iSvg;
        }
      }
    }

    lastTimeStamp = timeStamp;
  }

  return {
    fs: frames,
    entityMeta: entityMeta,
    state: state,
    render: render,
    removeInteractivity: removeInteractivity
  };
}