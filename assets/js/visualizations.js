import { observeVisuals } from './visualizations/shared.js';
import { renderTheoryVisual } from './visualizations/theory.js';
import { renderResearchVisual } from './visualizations/research.js';

const visuals = [...document.querySelectorAll('[data-scientific-visual]')];

visuals.forEach((visual) => {
  renderTheoryVisual(visual, visual.dataset.scientificVisual);
  renderResearchVisual(visual, visual.dataset.scientificVisual);
});

observeVisuals(visuals);
