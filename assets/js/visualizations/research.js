import { append, addArrowMarker, groups } from './shared.js';

function renderDissipative(visual) {
  const { structure, flow } = groups(visual);
  const paths = [
    'M62 72C142 42 214 80 242 144S316 239 408 204',
    'M52 150C128 105 188 124 226 169S310 227 408 204',
    'M64 250C140 285 222 249 257 214S337 187 408 204',
    'M122 48C184 102 193 172 244 204S340 218 408 204',
  ];
  paths.forEach((d, index) => {
    append(structure, 'path', { d, class: 'motif__trajectory' });
    append(flow, 'path', { d, class: 'motif__decay', style: `--i:${index}` });
  });
  [46, 30, 16].forEach((radius, index) => append(structure, 'circle', { cx: 408, cy: 204, r: radius, class: 'motif__attractor-ring', style: `--i:${index}` }));
  append(structure, 'circle', { cx: 408, cy: 204, r: 4, class: 'motif__node-core' });
}

function renderMolecular(visual) {
  const { svg, structure, flow } = groups(visual);
  const markerId = `transport-arrow-${Math.random().toString(36).slice(2, 8)}`;
  addArrowMarker(svg, markerId);
  append(structure, 'rect', { x: 38, y: 62, width: 72, height: 196, rx: 8, class: 'motif__reservoir' });
  append(structure, 'rect', { x: 370, y: 62, width: 72, height: 196, rx: 8, class: 'motif__reservoir' });
  [86, 112, 138, 164, 190, 216, 242].forEach((y) => {
    append(structure, 'line', { x1: 48, y1: y, x2: 100, y2: y, class: 'motif__reservoir-level' });
    append(structure, 'line', { x1: 380, y1: y + 5, x2: 432, y2: y + 5, class: 'motif__reservoir-level' });
  });
  const molecule = [[156, 160], [198, 126], [242, 160], [286, 126], [328, 160]];
  molecule.forEach(([cx, cy], index) => {
    if (index) append(structure, 'line', { x1: molecule[index - 1][0], y1: molecule[index - 1][1], x2: cx, y2: cy, class: 'motif__bond' });
    append(structure, 'circle', { cx, cy, r: index % 2 ? 8 : 11, class: 'motif__molecule-node' });
  });
  const currentPath = 'M104 160C150 196 186 198 228 160S310 118 374 160';
  append(structure, 'path', { d: currentPath, class: 'motif__edge', 'marker-end': `url(#${markerId})` });
  [0, 1, 2].forEach((index) => append(flow, 'path', { d: currentPath, class: 'motif__charge-flow', style: `--i:${index}` }));
}

function renderStochastic(visual) {
  const { structure, flow } = groups(visual);
  const points = [[76, 194], [132, 86], [198, 166], [270, 72], [304, 228], [402, 144]];
  const links = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [3, 5], [4, 5], [3, 4]];
  links.forEach(([a, b], index) => {
    append(structure, 'line', { x1: points[a][0], y1: points[a][1], x2: points[b][0], y2: points[b][1], class: 'motif__network-edge' });
    if (index % 2 === 0) append(flow, 'line', { x1: points[a][0], y1: points[a][1], x2: points[b][0], y2: points[b][1], class: 'motif__network-pulse', style: `--i:${index}` });
  });
  points.forEach(([cx, cy], index) => {
    append(structure, 'circle', { cx, cy, r: 12, class: 'motif__node-shell motif__node-shell--violet' });
    append(structure, 'circle', { cx, cy, r: 3, class: 'motif__node-core motif__node-core--violet', style: `--i:${index}` });
  });
}

function renderSparse(visual) {
  const { structure, flow } = groups(visual);
  const matrixPoints = [[0, 0], [0, 3], [1, 1], [1, 4], [2, 0], [2, 2], [3, 1], [3, 4], [4, 2], [4, 3]];
  matrixPoints.forEach(([row, column], index) => append(structure, 'rect', {
    x: 60 + column * 25,
    y: 92 + row * 25,
    width: 7,
    height: 7,
    rx: 1.5,
    class: 'motif__matrix-entry',
    style: `--i:${index}`,
  }));
  append(structure, 'path', { d: 'M206 155H262', class: 'motif__operator-arrow' });
  append(structure, 'path', { d: 'm252 148 12 7-12 7', class: 'motif__operator-arrow' });
  const nodes = [[302, 100], [356, 82], [404, 130], [330, 190], [404, 222]];
  const links = [[0, 1], [0, 3], [1, 2], [2, 3], [2, 4], [3, 4]];
  links.forEach(([a, b]) => append(structure, 'line', { x1: nodes[a][0], y1: nodes[a][1], x2: nodes[b][0], y2: nodes[b][1], class: 'motif__network-edge' }));
  nodes.forEach(([cx, cy], index) => append(structure, 'circle', { cx, cy, r: 6, class: 'motif__software-node', style: `--i:${index}` }));
  append(flow, 'path', { d: 'M64 244C165 270 266 246 328 199S396 143 424 76', class: 'motif__mode' });
}

function renderCircuit(visual) {
  const { structure, flow } = groups(visual);
  const wires = [92, 138, 184, 230];
  wires.forEach((y, index) => {
    append(structure, 'line', { x1: 44, y1: y, x2: 290, y2: y, class: 'motif__wire' });
    append(structure, 'text', { x: 48, y: y - 10, class: 'motif__symbol' }, `q${index + 1}`);
  });
  [[108, 92], [172, 184], [236, 138]].forEach(([x, y], index) => append(structure, 'rect', { x: x - 12, y: y - 12, width: 24, height: 24, rx: 4, class: 'motif__gate', style: `--i:${index}` }));
  append(structure, 'line', { x1: 108, y1: 92, x2: 108, y2: 230, class: 'motif__control' });
  append(structure, 'circle', { cx: 108, cy: 230, r: 6, class: 'motif__control-node' });
  append(structure, 'line', { x1: 236, y1: 138, x2: 236, y2: 184, class: 'motif__control' });
  append(structure, 'circle', { cx: 236, cy: 184, r: 5, class: 'motif__control-node' });
  const nodes = [[338, 104], [390, 82], [428, 146], [356, 206], [420, 232]];
  [[0, 1], [0, 2], [0, 3], [2, 4], [3, 4]].forEach(([a, b]) => append(structure, 'line', { x1: nodes[a][0], y1: nodes[a][1], x2: nodes[b][0], y2: nodes[b][1], class: 'motif__network-edge' }));
  nodes.forEach(([cx, cy], index) => append(flow, 'circle', { cx, cy, r: 5, class: 'motif__algorithm-node', style: `--i:${index}` }));
  append(flow, 'path', { d: 'M290 160C320 160 322 128 338 104', class: 'motif__charge-flow' });
}

export function renderResearchVisual(visual, type) {
  if (type === 'dissipative') renderDissipative(visual);
  if (type === 'molecular') renderMolecular(visual);
  if (type === 'stochastic') renderStochastic(visual);
  if (type === 'sparse') renderSparse(visual);
  if (type === 'circuit') renderCircuit(visual);
}
