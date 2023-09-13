// Basic A* impplementation.
function tileId(tile) {
  return tile[0] * 18 + tile[1];
}

function aStar(start, end) {
  var unchecked = [start];
  var history = [];
  var g = [];
  var f = [];
  var current;
  var result;

  g[tileId(start)] = 0;
  f[tileId(start)] = pythag(start, end);

  while (unchecked.length !== 0) {
    current = unchecked.sort((a, b) => f[tileId(a)] - f[tileId(b)])[0];

    if (current[0] === end[0] && current[1] === end[1]) {
      result = [current];
    
      while (history[tileId(current)] !== undefined) {
        current = history[tileId(current)];
        result.unshift(current);
      }
    
      return result;
    }

    unchecked.splice(unchecked.indexOf(current), 1);

    getLiberties(current).forEach(liberty => {
      var gCandidate = (g[tileId(current)] === undefined ? INF : g[tileId(current)]) + 1;
      
      if (gCandidate < (g[tileId(liberty)] === undefined ? INF : g[tileId(liberty)])) {
        history[tileId(liberty)] = current;
        g[tileId(liberty)] = gCandidate;
        f[tileId(liberty)] = gCandidate + pythag(liberty, end);

        if (unchecked.indexOf(liberty) === -1) {
          unchecked.push(liberty);
        }
      }
    });
  }

  return [];
}

function getLiberties(cur) {
  var liberties = [];

  if (tileMapSpaces[cur[0] - 1] && tileMapSpaces[cur[0] - 1][cur[1]] === 1) {
    liberties.push([cur[0] - 1, cur[1]]);
  }

  if (tileMapSpaces[cur[0] + 1] && tileMapSpaces[cur[0] + 1][cur[1]] === 1) {
    liberties.push([cur[0] + 1, cur[1]]);
  }

  if (tileMapSpaces[cur[0]][cur[1] - 1] === 1) {
    liberties.push([cur[0], cur[1] - 1]);
  }

  if (tileMapSpaces[cur[0]][cur[1] + 1] === 1) {
    liberties.push([cur[0], cur[1] + 1]);
  }

  return liberties;
}