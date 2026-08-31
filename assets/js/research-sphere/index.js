import { readSphereData } from './data.js';
import { supportsWebGL, createMotionPreference } from './accessibility.js';
import { createInteractions } from './interactions.js';
import { createResizeController, positionLabels } from './responsive.js';

const root = document.querySelector('[data-research-sphere]');

if (root) {
  const model = readSphereData(root);
  const stage = root.querySelector('[data-sphere-stage]');
  const canvas = root.querySelector('[data-sphere-canvas]');
  let scene = null;
  let animator = null;
  let stopResize = null;

  const interactions = createInteractions(root, model, {
    onSelect(index) {
      scene?.select(index);
      animator?.requestRender();
    },
  });

  const motion = createMotionPreference(() => animator?.requestRender());

  const useFallback = () => {
    root.classList.remove('is-loading');
    root.classList.add('is-fallback');
  };

  async function initialize() {
    if (!supportsWebGL()) {
      useFallback();
      return;
    }

    root.classList.add('is-loading');
    try {
      const [{ createSphereScene }, { startAnimation }] = await Promise.all([
        import('./scene.js'),
        import('./animation.js'),
      ]);
      scene = createSphereScene(canvas, model);
      stopResize = createResizeController(canvas, scene);
      animator = startAnimation({
        root,
        scene,
        interaction: interactions.state,
        motion,
        onFrame: () => positionLabels(stage, interactions.labels, scene.projectNodes()),
      });
      root.classList.remove('is-loading');
      root.classList.add('is-webgl');
      animator.requestRender();
    } catch (error) {
      console.warn('Interactive research landscape unavailable; using static map.', error);
      scene?.destroy();
      stopResize?.();
      useFallback();
    }
  }

  const gate = new IntersectionObserver(([entry]) => {
    if (!entry.isIntersecting) return;
    gate.disconnect();
    initialize();
  }, { rootMargin: '280px' });
  gate.observe(root);
}
