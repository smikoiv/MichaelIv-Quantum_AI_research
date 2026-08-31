export function initializeApplicationFields() {
  document.querySelectorAll('[data-application-field]').forEach((field) => {
    const nodes = [...field.querySelectorAll('[data-application-node]')];
    const activate = (index) => {
      field.dataset.activeApplication = String(index);
      nodes.forEach((node, nodeIndex) => node.classList.toggle('is-active', nodeIndex === index));
    };

    const clear = () => {
      delete field.dataset.activeApplication;
      nodes.forEach((node) => node.classList.remove('is-active'));
    };

    nodes.forEach((node, index) => {
      node.addEventListener('pointerenter', () => activate(index));
      node.addEventListener('focus', () => activate(index));
    });

    field.addEventListener('pointerleave', () => {
      if (!field.contains(document.activeElement)) clear();
    });

    field.addEventListener('focusout', (event) => {
      if (!field.contains(event.relatedTarget)) clear();
    });
  });
}
