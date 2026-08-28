export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2', { failIfMajorPerformanceCaveat: true })
      || canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
    if (!context) return false;
    context.getExtension('WEBGL_lose_context')?.loseContext();
    return true;
  } catch {
    return false;
  }
}

export function createMotionPreference(onChange) {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)');
  const notify = () => onChange?.(query.matches);
  query.addEventListener?.('change', notify);

  return {
    get reduced() {
      return query.matches;
    },
    destroy() {
      query.removeEventListener?.('change', notify);
    },
  };
}

export function announceSelection(root, item) {
  const status = root.querySelector('.sphere-status');
  if (status) status.textContent = `${item.title} — ${item.description}`;
}

export function enableSpatialKeyboard(labels, onSelect) {
  labels.forEach((label, index) => {
    label.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
      event.preventDefault();
      const direction = ['ArrowRight', 'ArrowDown'].includes(event.key) ? 1 : -1;
      const next = (index + direction + labels.length) % labels.length;
      labels[next].focus();
      onSelect(next);
    });
  });
}
