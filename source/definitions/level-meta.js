// Re-usable info text.
var lt = {
  p: "Peons can capture 1 square diagonally.<br><pre>X X<br/> P <br>X X</pre>",
  r: "Roques capture vertically and horizontally, but can be blocked.<br/><pre>  X  <br>  X  <br>XXRXX<br>  X  <br>  X  </pre>",
  b: "Alfils capture by jumping 2 squares diagonally only.<br/><pre>X   X<br>     <br>  A  <br>     <br>X   X</pre>"
};

var b = (x, y, x1, y1) => {
  var arr = [];
  for (i = x; i <= x1; i++) {
    for (j = y; j <= y1; j++) {
      arr.push(i);
      arr.push(j);
    }
  }
  return arr;
};

var f = (arr) => [].concat.apply([], arr);

// Meta info about each level, including merlins start location, map and interactivity.
var levelMetas = {
  bridge: {
    wiu: { cx: 0, cy: 0, tx: 3, ty: 10, canFlip: true },
    wid: { cx: 0, cy: 0, tx: 3, ty: 10, canFlip: true },
    tm: [
      {
        s: f([
                            b(3,6,3,12),
                      2,7,  
                1,8,  2,8,  
          0,9,  1,9,  2,9,  
                1,10, 2,10, 
                      2,11
        ]),
        i: [],
        d: []
      },
      {
        s: [],
        i: []
      },
      {
        s: f([
          b(4,9,8,11)
        ]),
        i: ['e', 8, 10],
        d: []
      }
    ],
    b3d: {
      x: 8,
      y: 11,
      i: 'b3d',
      r: [
        'x',
        [0, PI / 2],
        90
      ],
      s: [0, 89],
      stm: [1, 2]
    },
    tx: 'Move golden objects by dragging them.'
  },
  courtyard: {
    wiu: { cx: 0, cy: 0, tx: 2, ty: 9, canFlip: true },
    wid: { cx: 0, cy: 0, tx: 2, ty: 9, canFlip: true },
    tm: [
      {
        s: f([
          b(2,7,6,11),
          b(12,7,16,11),
                                                      7,7,  8,7,      10,7,  11,7,  
                1,8,                                   7,8,  8,8,      10,8,  11,8, 
          0,9,  1,9,                                                                 
                1,10                                                                
                                                                                     
        ]),
        i: ['e', 14, 9],
        d: []
      },
      {
        s: f([b(9,9,11,11)]),
        i: [],
        d: []
      },
      {
        s: f([b(8,9,10,11)]),
        i: [],
        d: []
      },
      {
        s: f([b(7,9,9,11)]),
        i: [],
        d: []
      }
    ],
    pl: {
      i: 'pl',
      m: [
        'y',
        [0, 2],
        20
      ],
      s: [0, 9, 19],
      stm: [1, 2, 3]
    },
    tx: "You cannot move objects while on them."
  },
  cellar: {
    wiu: { cx: 0, cy: 0, tx: 4, ty: 10, canFlip: true },
    wid: { cx: 0, cy: 0, tx: 4, ty: 10, canFlip: true },
    tm: [
      {
        s: [
                                                                10,4,
                                                          9,5,  10,5,

                         4,7,   5,7,
                                5,8,                                               13,8,  14,8,

                         4,10,  5,10,                                              13,10,
                                                                                   13,11,
                                                                                   13,12,
                                              7,13, 8,13, 9,13
        ],
        i: ['e', 14, 8]
      },
      {
        s: f([
                                                    8,6,       10,6,
                                              7,7,  8,7,       10,7,
                                              7,8,       9,8,  10,8,
                                        6,9,  7,9,       9,9,
                                                         9,10,
                                                         b(9,11,12,11)
        ]),
        i: []
      },
      {
        s: [
                                                        9,6,
                                                        9,7,   10,7,  11,7,
                                                                      11,8, 12,8,
                                          7,9,    8,9,  9,9,   10,9,     
                                          7,10,                10,10, 11,10,12,10,
                                          7,11,
                                          7,12

        ],
        i: []
      },
      {
        s: [
                                        6,7,  7,7,  8,7, 9,7,
                                                         9,8,
                                                         9,9,       11,9, 12,9,
                                                    8,10,9,10,      11,10,
                                                    8,11,     10,11,11,11,
                                                    8,12,     10,12
                                                         

        ],
        i: []
      },
      {
        s: [
                                                                      11,6,
                                                                      11,7,
                                        6,8,   7,8,  8,8,             11,8, 
                                                     8,9,  9,9, 10,9, 11,9,     
                                        6,10,  7,10,
                                               7,11, 8,11, 9,11,
                                                           9,12,
        ],
        i: []
      }
    ],
    wlk3d: {
      x: 10,
      y: 14,
      i: 'wlk3d',
      r: [
        'z',
        [0, PI * 2],
        360
      ],
      s: [0, 89, 179, 269, 359],
      stm: [1, 2, 3, 4, 1],
      ds: true
    }
  },
  garrison: {
    wiu: { cx: 0, cy: 0, tx: 3, ty: 9, canFlip: true },
    wid: { cx: 0, cy: 0, tx: 3, ty: 9, canFlip: true },
    tm: [
      {
        s: f([
          b(3,9,15,9),
          b(4,10,8,10),
          b(10,10,14,10)
        ]),
        i: ['e', 15, 9, 'p', 6, 8, 'p', 12, 8]
      } 
    ],
    tx: lt['p']
  },
  hall: {
    wiu: { cx: 0, cy: 0, tx: 3, ty: 9, canFlip: true },
    wid: { cx: 0, cy: 0, tx: 3, ty: 9, canFlip: true },
    tm: [
      {
        s: f([
          b(3,9,15,9),
          b(6,10,12,11)
        ]),
        i: ['e', 15, 9, 'r', 8, 7, 'r', 11, 7]
      },
      {
        s: [],
        i: ['p', 9, 8, 'p', 13, 8, 'x', 15, 8]
      },
      {
        s: [],
        i: ['p', 8, 8, 'p', 12, 8, 'x', 14, 8]
      },
      {
        s: [],
        i: ['p', 7, 8, 'p', 11, 8, 'x', 13, 8]
      },
      {
        s: [],
        i: ['p', 6, 8, 'p', 10, 8, 'x', 12, 8]
      },
      {
        s: [],
        i: ['p', 5, 8, 'p', 9, 8, 'x', 11, 8]
      } 
    ],
    hpl: {
      i: 'hpl',
      m: [
        'y',
        [0, 4],
        40
      ],
      s: [0, 10, 20, 30, 39],
      stm: [1, 2, 3, 4, 5],
      defaultF: 20
    },
    tx: lt['r']
  },
  chapel: {
    wiu: { cx: 0, cy: 0, tx: 3, ty: 10, canFlip: true },
    wid: { cx: 0, cy: 0, tx: 3, ty: 10, canFlip: true },
    tm: [
      {
        s: f([
                            3,9,  4,9,   5,9,   6,9,               b(9,9,15,9),
                            b(2,10,16,10),
                            b(3,11,15,11)
        ]),
        i: ['e', 16, 10, 'b', 6, 8, 'b', 9, 12, 'b', 12, 8, 'b', 12, 13]
      }
    ],
    tx: lt['b']
  },
  throne: {
    wiu: { cx: 0, cy: 0, tx: 3, ty: 10, canFlip: true },
    wid: { cx: 0, cy: 0, tx: 3, ty: 10, canFlip: true },
    tm: [
      {
        s: f([
          b(5,10,12,12),
          3,10,  4,10,                                                     13,10, 14,10
        ]),
        i: ['e', 14, 10, 'b', 11, 13, 'p', 9, 13, 'x', 4, 8, 'x', 13, 8]
      },
      {
        s: [],
        i: ['r', 8, 7, 'r', 10, 7, 'r', 13, 7]
      },
      {
        s: [],
        i: ['r', 7, 7, 'r', 9, 7, 'r', 12, 7]
      },
      {
        s: [],
        i: ['r', 6, 7, 'r', 8, 7, 'r', 11, 7]
      },
      {
        s: [],
        i: ['r', 5, 7, 'r', 7, 7, 'r', 10, 7]
      },
      {
        s: [],
        i: ['r', 4, 7, 'r', 6, 7, 'r', 9, 7]
      },
      {
        s: [],
        i: ['p', 10, 9, 'x', 15, 9, 'x', 16, 9]
      },
      {
        s: [],
        i: ['p', 9, 9, 'x', 14, 9, 'x', 15, 9]
      },
      {
        s: [],
        i: ['p', 8, 9, 'x', 13, 9, 'x', 14, 9]
      },
      {
        s: [],
        i: ['p', 7, 9, 'x', 12, 9, 'x', 13, 9]
      },
      {
        s: [],
        i: ['p', 6, 9, 'x', 11, 9, 'x', 12, 9]
      }
    ],
    trpl1: {
      i: 'trpl1',
      m: [
        'y',
        [0, 4],
        40
      ],
      s: [0, 10, 20, 30, 39],
      stm: [6, 7, 8, 9, 10],
      defaultF: 20
    },
    trpl2: {
      i: 'trpl2',
      m: [
        'y',
        [0, 4],
        40
      ],
      s: [0, 10, 20, 30, 39],
      stm: [1, 2, 3, 4, 5],
      defaultF: 20
    }
  }
};