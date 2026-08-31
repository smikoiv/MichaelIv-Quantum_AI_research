const MOBILE_QUERY = '(max-width: 860px)';

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
  const centerX = bounds.width / 2;
  const labelGap = Math.max(42, ...labels.map((label) => label.getBoundingClientRect().height + 6));
  const placed = projections.map((point, index) => {
    const band = 1 + (index % 3) * 0.055;
    const labelWidth = labels[index].getBoundingClientRect().width;
    const projectedX = Math.min(bounds.width - insetX, Math.max(insetX, point.x * band));
    const x = projectedX < centerX
      ? Math.min(projectedX, centerX - (labelWidth / 2) - 12)
      : Math.max(projectedX, centerX + (labelWidth / 2) + 12);
    return {
      index,
      x,
      y: Math.min(bounds.height - insetY, Math.max(insetY, point.y * band)),
      depth: point.depth,
    };
  });

  const sides = [placed.filter((point) => point.x < centerX), placed.filter((point) => point.x >= centerX)];
  sides.forEach((side, sideIndex) => {
    const bottomInset = sideIndex === 0 ? 150 : insetY;
    side.sort((a, b) => a.y - b.y);
    for (let index = 1; index < side.length; index += 1) {
      side[index].y = Math.max(side[index].y, side[index - 1].y + labelGap);
    }
    if (side.length && side[side.length - 1].y > bounds.height - bottomInset) {
      const overflow = side[side.length - 1].y - (bounds.height - bottomInset);
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
