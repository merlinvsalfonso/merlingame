// Calculates the cross product from point. Returns a vector normal.
function getCrossProduct(p1, p2, p3) {
  var v1 = [p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]];
  var v2 = [p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]];

  return [
    v1[1] * v2[2] - v1[2] * v2[1],
    v1[2] * v2[0] - v1[0] * v2[2],
    v1[0] * v2[1] - v1[1] * v2[0]
  ];
}

// Rotates a path's d in 3d space.
function rotateD(d, x, y, z) {
  return d.map(point => {
    var y1 = point[1] * cos(x) + point[2] * sin(x);
    var z1 = point[2] * cos(x) - point[1] * sin(x);
    var x2 = point[0] * cos(y) + z1 * sin(y);

    return [
      x2 * cos(z) - y1 * sin(z),
      x2 * sin(z) + y1 * cos(z),
      -point[0] * sin(y) + z1 * cos(y)
    ];
  });
}

// Keep angle between 0 and 360
function normalizeAngle(ang) {
  ang = ang % (2 * PI);

  return ang < 0 ? ang + PI * 2 : ang;
}

// Basic conversions.
function convertToDegrees(rad) {
  return rad * (180 / PI);
}

function convertToRadians(deg) {
  return deg * (PI / 180);
}

// Difference between angles (wraps)
function angDiff(ang1, ang2) {
  var ang1 = normalizeAngle(ang1);
  var ang2 = normalizeAngle(ang2);
  var diff = ang1 - ang2;

  if (diff > PI) {
    diff = diff - 2 * PI;
  } else if (diff < -PI) {
    diff = diff + 2 * PI
  }

  return diff;
}

// Keep value between higher and lower bound.
function bound(val, higher, lower) {
  return M.max(lower, M.min(higher, val));
}

// Get distance between points.
function pythag(a, b) {
  return M.sqrt(M.pow(a[0] - b[0], 2) + M.pow(a[1] - b[1], 2));
}