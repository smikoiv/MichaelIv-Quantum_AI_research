export function startAnimation({ root, scene, interaction, motion, onFrame }) {
  let frame = 0;
  let active = true;
  let visible = document.visibilityState !== 'hidden';
  let previous = performance.now();

  const render = (time) => {
    if (!active || !visible) return;
    const delta = Math.min(48, time - previous);
    previous = time;
    scene.tick(time, delta, interaction, motion.reduced);
    onFrame?.();
    if (!motion.reduced) frame = requestAnimationFrame(render);
  };

  const requestRender = () => {
    cancelAnimationFrame(frame);
    previous = performance.now();
    frame = requestAnimationFrame(render);
  };

  const observer = new IntersectionObserver(([entry]) => {
    active = entry.isIntersecting;
    if (active) requestRender();
    else cancelAnimationFrame(frame);
  }, { rootMargin: '120px' });
  observer.observe(root);

  const onVisibility = () => {
    visible = document.visibilityState !== 'hidden';
    if (visible && active) requestRender();
    else cancelAnimationFrame(frame);
  };
  document.addEventListener('visibilitychange', onVisibility);

  return {
    requestRender,
    destroy() {
      cancelAnimationFrame(frame);
      observer.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
    },
  };
}
