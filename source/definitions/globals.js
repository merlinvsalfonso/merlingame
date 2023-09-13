// Tile Maps
var tileMapSpaces;
var tileMapItems;
var tileMapLose;

// Function Shorthands
var M = Math;
var sin = M.sin;
var cos = M.cos;
var cloneObject = (obj) => JSON.parse(JSON.stringify(obj));
var getRect = (el) => el.getBoundingClientRect();
var qs = q => document.querySelector(q);

// Elements
var bodyEl = qs('body');
var containerDiv = qs('.container');
var levelDiv = qs('.level');
var tilesDiv = qs('.tiles');
var canvas = qs('.c');
var modal = qs('.m');
var modalParent = modal.parentNode;
var button = qs('.h button');
var ctx = canvas.getContext('2d');

// References
var canvasLeft;
var canvasTop;
var canvasWidth;
var canvasHeight;
var dragTs;

// Constants
var INF = 100000;
var REL_WIDTH = 1920;
var REL_HEIGHT = 1108;
var PROJECTION_ANGLE = M.sqrt(3) / 3;
var ADJ = 96;
var OPP = ADJ * PROJECTION_ANGLE;
var PI = M.PI;
var SQRT_2 = M.sqrt(2);
var SVG_WIDTH = 1920;
var SVG_HEIGHT = 1108;

// Templates
var svgTemplate = (defs, paths, flipped) => `<svg ${flipped ? 'style="transform: scaleX(-1);"' : ''} width="${REL_WIDTH}" height="${REL_HEIGHT}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${REL_WIDTH} ${REL_HEIGHT}"><defs>${defs}</defs>${paths}</svg>`;
var gradientTemplate = (id, x1, y1, c1, x2, y2, c2) => `<linearGradient gradientUnits="userSpaceOnUse" id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}"><stop offset="0" stop-color="#${c1}" /><stop offset="1" stop-color="#${c2}" /></linearGradient>`;
var pathTemplate = (fill, stroke, strokeWidth, d, i, z, t) => `<path style="${fill ? 'fill:' + fill : ''};stroke:${stroke ? stroke : '#000'};stroke-width:${strokeWidth ? strokeWidth : '3'};stroke-linecap:round;stroke-linejoin:round;" d="M ${d} ${z ? 'Z' : ''}" data-index="${i}" ${t ? 'class="is-tile"' : ''} />`;