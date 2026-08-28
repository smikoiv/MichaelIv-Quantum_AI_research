const MOBILE_QUERY = '(max-width: 700px)';

export function createResizeController(container, scene) {
  const update = () => {
    const bounds = container.getBoundingClientRect();
    scene.resize(Math.max(1, bounds.width), Math.max(1, bounds.height));
  };
  const observer = new ResizeObserver(update);
  observer.observe(container);
  update();
  return () => observer.disconnect();
}

export function positionLabels(stage, labels, projections) {
  if (window.matchMedia(MOBILE_QUERY).matches) {
    labels.forEach((label) => {
      label.style.removeProperty('--label-x');
      label.style.removeProperty('--label-y');
      label.style.removeProperty('--label-depth');
    });
    return;
  }

  const bounds = stage.getBoundingClientRect();
  const insetX = Math.min(168, bounds.width * 0.2);
  const insetY = 52;
  const placed = projections.map((point, index) => {
    const band = 1 + (index % 3) * 0.055;
    return {
      index,
      x: Math.min(bounds.width - insetX, Math.max(insetX, point.x * band)),
      y: Math.min(bounds.height - insetY, Math.max(insetY, point.y * band)),
      depth: point.depth,
    };
  });

  const sides = [placed.filter((point) => point.x < bounds.width / 2), placed.filter((point) => point.x >= bounds.width / 2)];
  sides.forEach((side) => {
    side.sort((a, b) => a.y - b.y);
    for (let index = 1; index < side.length; index += 1) {
      side[index].y = Math.max(side[index].y, side[index - 1].y + 31);
    }
    if (side.length && side[side.length - 1].y > bounds.height - insetY) {
      const overflow = side[side.length - 1].y - (bounds.height - insetY);
      side.forEach((point) => { point.y -= overflow; });
    }
  });

  placed.forEach((point) => {
    const label = labels[point.index];
    label.style.setProperty('--label-x', `${point.x}px`);
    label.style.setProperty('--label-y', `${point.y}px`);
    label.style.setProperty('--label-depth', point.depth.toFixed(3));
    label.classList.toggle('is-distant', point.depth > 0.45);
  });
}
