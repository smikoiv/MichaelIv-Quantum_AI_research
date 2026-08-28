import { append, addArrowMarker, groups } from './shared.js';

function renderMarkov(visual) {
  const { svg, structure, flow } = groups(visual);
  const markerId = `markov-arrow-${Math.random().toString(36).slice(2, 8)}`;
  addArrowMarker(svg, markerId);
  const points = [
    [82, 162], [176, 78], [190, 242], [306, 92], [370, 214],
  ];
  const edges = [
    ['M92 151Q125 103 166 84', 0],
    ['M169 91Q120 122 91 156', 1],
    ['M93 174Q132 221 180 237', 2],
    ['M183 229Q135 205 98 170', 3],
    ['M187 79Q242 54 296 86', 4],
    ['M301 104Q251 151 201 230', 5],
    ['M205 239Q291 262 362 221', 6],
    ['M366 202Q344 143 312 102', 7],
  ];

  edges.forEach(([d, index]) => {
    append(structure, 'path', { d, class: 'motif__edge', 'marker-end': `url(#${markerId})` });
    append(flow, 'path', { d, class: 'motif__current', style: `--i:${index}` });
  });
  points.forEach(([cx, cy], index) => {
    append(structure, 'circle', { cx, cy, r: 12, class: 'motif__node-shell' });
    append(structure, 'circle', { cx, cy, r: 3.2, class: 'motif__node-core', style: `--i:${index}` });
    append(structure, 'text', { x: cx + 18, y: cy - 14, class: 'motif__symbol' }, `p${index + 1}`);
  });
}

function cubeEdges(offsetX, offsetY, size) {
  const front = [
    [offsetX, offsetY], [offsetX + size, offsetY], [offsetX + size, offsetY + size], [offsetX, offsetY + size],
  ];
  const back = front.map(([x, y]) => [x + size * 0.42, y - size * 0.32]);
  const edges = [];
  [front, back].forEach((face) => {
    face.forEach((point, index) => edges.push([point, face[(index + 1) % 4]]));
  });
  front.forEach((point, index) => edges.push([point, back[index]]));
  return { nodes: [...front, ...back], edges };
}

function renderHypercube(visual) {
  const { structure, flow } = groups(visual);
  const outer = cubeEdges(92, 96, 142);
  const inner = cubeEdges(176, 130, 74);
  [...outer.edges, ...inner.edges].forEach(([[x1, y1], [x2, y2]], index) => {
    append(structure, 'line', { x1, y1, x2, y2, class: 'motif__edge', style: `--i:${index}` });
  });
  outer.nodes.forEach(([x1, y1], index) => {
    const [x2, y2] = inner.nodes[index];
    append(structure, 'line', { x1, y1, x2, y2, class: 'motif__dimension-edge' });
  });
  [...outer.nodes, ...inner.nodes].forEach(([cx, cy], index) => {
    append(structure, 'circle', { cx, cy, r: index < 8 ? 4.5 : 3.5, class: 'motif__node-core', style: `--i:${index}` });
  });
  append(flow, 'path', { d: 'M96 245Q215 290 342 228T411 92', class: 'motif__orbit' });
  append(flow, 'circle', { cx: 333, cy: 231, r: 5, class: 'motif__traveller' });
}

function renderTensor(visual) {
  const { structure, flow } = groups(visual);
  const columns = [82, 142, 202];
  const rows = [92, 160, 228];
  columns.forEach((x, columnIndex) => {
    rows.forEach((y, rowIndex) => {
      const index = columnIndex * rows.length + rowIndex;
      append(structure, 'rect', { x: x - 8, y: y - 8, width: 16, height: 16, rx: 3, class: 'motif__tensor-node', style: `--i:${index}` });
      if (columnIndex < columns.length - 1) append(structure, 'line', { x1: x + 8, y1: y, x2: columns[columnIndex + 1] - 8, y2: rows[(rowIndex + columnIndex) % 3], class: 'motif__edge' });
      if (rowIndex < rows.length - 1) append(structure, 'line', { x1: x, y1: y + 8, x2: x, y2: rows[rowIndex + 1] - 8, class: 'motif__edge motif__edge--faint' });
    });
  });
  append(structure, 'path', { d: 'M235 160H282', class: 'motif__operator-arrow' });
  append(structure, 'rect', { x: 252, y: 138, width: 18, height: 44, rx: 9, class: 'motif__operator' });
  [0, 1, 2, 3].forEach((index) => {
    const y = 88 + index * 48;
    const amplitude = 12 + index * 2;
    append(flow, 'path', {
      d: `M300 ${y}C318 ${y - amplitude} 338 ${y + amplitude} 356 ${y}S396 ${y - amplitude} 420 ${y}`,
      class: 'motif__mode',
      style: `--i:${index}`,
    });
    append(flow, 'text', { x: 426, y: y + 4, class: 'motif__symbol' }, `λ${index + 1}`);
  });
}

export function renderTheoryVisual(visual, type) {
  if (type === 'markov') renderMarkov(visual);
  if (type === 'hypercube') renderHypercube(visual);
  if (type === 'tensor') renderTensor(visual);
}
