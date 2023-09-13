// Snaps the gold objects to the nearest snap point.
function snap(current, entityMeta, timeStampDiff) {
  var closestSnapDifference = INF;
  var closestSnap = entityMeta.s[0];
  var frameMax = (entityMeta.m ? entityMeta.m[2] : entityMeta.r[2]) - 1;
  var finalSnapD = 0;

  entityMeta.s.forEach(snap => {
    var snapDifference = snap - current;
    var snapDifferenceWrap = snap - (current + frameMax);

    if (M.abs(snapDifferenceWrap) < M.abs(snapDifference)) {
      snapDifference = snapDifferenceWrap;
    }

    if (M.abs(snapDifference) < M.abs(closestSnapDifference)) {
      closestSnapDifference = snapDifference;
      closestSnap = snap;
    }
  });

  if (closestSnapDifference > 0) {
    finalSnapD = M.round(M.ceil(closestSnapDifference * timeStampDiff / 100));

    if (finalSnapD > closestSnapDifference) {
      finalSnapD = closestSnapDifference;
    }
  } else {
    finalSnapD = M.round(M.floor(closestSnapDifference * timeStampDiff / 100));

    if (finalSnapD < closestSnapDifference) {
      finalSnapD = closestSnapDifference;
    }
  }

  return {
    upd: bound(M.round(current + finalSnapD), frameMax, 0),
    val: closestSnap
  };
}