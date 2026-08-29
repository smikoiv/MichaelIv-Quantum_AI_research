import { announceSelection, enableSpatialKeyboard } from './accessibility.js';

export function createInteractions(root, model, callbacks) {
  const stage = root.querySelector('[data-sphere-stage]');
  const labels = [...root.querySelectorAll('[data-sphere-node]')];
  const state = {
    parallaxX: 0,
    parallaxY: 0,
    dragX: 0,
    dragY: 0,
    dragging: false,
    activeIndex: -1,
  };
  let pointer = null;
  let keyboardMode = false;

  const select = (index) => {
    if (index < 0 || index >= model.items.length) return;
    state.activeIndex = index;
    labels.forEach((label, labelIndex) => label.classList.toggle('is-selected', labelIndex === index));
    root.dataset.activeGroup = model.items[index].group;
    announceSelection(root, model.items[index]);
    callbacks.onSelect?.(index);
  };

  labels.forEach((label, index) => {
    label.addEventListener('pointerenter', () => {
      if (!keyboardMode) select(index);
    });
    label.addEventListener('focus', () => {
      keyboardMode = true;
      select(index);
    });
  });

  enableSpatialKeyboard(labels, select);

  stage.addEventListener('pointermove', (event) => {
    keyboardMode = false;
    const bounds = stage.getBoundingClientRect();
    state.parallaxX = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
    state.parallaxY = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;

    if (!state.dragging || !pointer) return;
    state.dragX += (event.clientX - pointer.x) * 0.005;
    state.dragY += (event.clientY - pointer.y) * 0.005;
    pointer = { x: event.clientX, y: event.clientY };
  }, { passive: true });

  stage.addEventListener('pointerdown', (event) => {
    keyboardMode = false;
    if (event.target.closest('a')) return;
    state.dragging = true;
    pointer = { x: event.clientX, y: event.clientY };
    stage.classList.add('is-dragging');
    stage.setPointerCapture?.(event.pointerId);
  });

  const release = (event) => {
    if (!state.dragging) return;
    state.dragging = false;
    pointer = null;
    stage.classList.remove('is-dragging');
    stage.releasePointerCapture?.(event.pointerId);
  };

  stage.addEventListener('pointerup', release);
  stage.addEventListener('pointercancel', release);
  stage.addEventListener('pointerleave', () => {
    if (!state.dragging) {
      state.parallaxX = 0;
      state.parallaxY = 0;
    }
  });

  return { state, labels, select };
}
