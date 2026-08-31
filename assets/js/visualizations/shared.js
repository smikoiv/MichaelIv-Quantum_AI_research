export const SVG_NS = 'http://www.w3.org/2000/svg';

export function svgElement(tag, attributes = {}, text = '') {
  const element = document.createElementNS(SVG_NS, tag);
  Object.entries(attributes).forEach(([key, value]) => element.setAttribute(key, String(value)));
  if (text) element.textContent = text;
  return element;
}

export function append(parent, tag, attributes = {}, text = '') {
  const element = svgElement(tag, attributes, text);
  parent.appendChild(element);
  return element;
}

export function addArrowMarker(svg, id) {
  let defs = svg.querySelector('defs');
  if (!defs) defs = svg.insertBefore(svgElement('defs'), svg.firstChild);
  const marker = append(defs, 'marker', {
    id,
    viewBox: '0 0 8 8',
    refX: 7,
    refY: 4,
    markerWidth: 5,
    markerHeight: 5,
    orient: 'auto-start-reverse',
  });
  append(marker, 'path', { d: 'M0 0 8 4 0 8Z', class: 'motif__arrowhead' });
}

export function groups(visual) {
  return {
    svg: visual.querySelector('svg'),
    structure: visual.querySelector('[data-motif-structure]'),
    flow: visual.querySelector('[data-motif-flow]'),
  };
}

export function observeVisuals(visuals) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => entry.target.classList.toggle('is-visible', entry.isIntersecting));
  }, { threshold: 0.18, rootMargin: '40px 0px' });
  visuals.forEach((visual) => observer.observe(visual));
}
