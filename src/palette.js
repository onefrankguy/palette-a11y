const palettes = require('../palettes');
const $ = require('./jquery');
const Color = require('./color');

const Palette = {};

let currentPalette = 'aap64';
let currentOrder = 'index';

const sortByIndex = () => 0;

const sortByLuminance = ({luminance: l1}, {luminance: l2}) => l2 - l1;

const sortByDistance = (color1, color2) => {
  const d1 = Color.distance(color1, Color.BLACK);
  const d2 = Color.distance(color2, Color.BLACK);

  return d2 - d1;
};

const getSortFromOrder = (order) => {
  switch (order) {
    case 'luminance':
      return sortByLuminance;
    case 'distance':
      return sortByDistance;
    default:
      return sortByIndex;
  }
};

const renderText = (color) => {
  const blackContrast = Color.contrast(color, Color.BLACK);
  const whiteContrast = Color.contrast(color, Color.WHITE);
  const klass = blackContrast > whiteContrast ? 'black' : 'white';

  return `<span class="${klass}">${color.id}</span>`;
};

const renderSwatch = (color, klass = 'swatch') => {
  let html = '';

  html += `<div class="${klass}" style="background-color: ${color.id};">`;
  html += renderText(color);
  html += `</div>`;

  return html;
};

const renderPaletteColors = (colors) => {
  let html = '';

  colors.forEach((color) => {
    html += renderSwatch(color);
  });

  return html;
};

const renderContrastingPalette = (pairs, order, cutoff) => {
  let html = '';

  const passed = {};

  pairs.forEach(({foreground, background, contrast}) => {
    if (cutoff(contrast)) {
      if (!passed[background.id]) {
        passed[background.id] = [];
      }
      passed[background.id].push({
        foreground,
        background,
        contrast,
      });
    }
  });

  const sort = getSortFromOrder(order);
  const keys = Object.keys(passed)
    .sort((color1, color2) => {
      const c1 = Color.parse(color1);
      const c2 = Color.parse(color2);

      return sort(c1, c2);
    });

  keys.forEach((key) => {
    const pairs = passed[key];
    const background = pairs[0].background;

    pairs.sort((color1, color2) => {
      const c1 = sort(color1, background);
      const c2 = sort(color2, background);

      return c1 - c2;
    });

    html += `<div class="swatch background" style="background-color: ${background.id};">`;
    html += renderSwatch(background, 'swatch background label');

    pairs.forEach(({foreground}) => {
      html += renderSwatch(foreground);
    });

    html += `</div>`;
  });

  return html;
};

const renderPaletteAAA = (pairs, order) => renderContrastingPalette(pairs, order, (c) => c >= 7);
const renderPaletteAA = (pairs, order) => renderContrastingPalette(pairs, order, (c) => c < 7 && c >= 4.5);
const renderPaletteUI = (pairs, order) => renderContrastingPalette(pairs, order, (c) => c < 4.5 && c >= 3);
const renderPaletteFX = (pairs, order) => renderContrastingPalette(pairs, order, (c) => c < 3);

const renderPalette = (palette, order) => {
  const colors = palette.colors
    .map(Color.parse)
    .filter((color) => color)
    .sort(getSortFromOrder(order));

  const pairs = Color.pairs(colors);

  $('#colors').html(renderPaletteColors(colors));
  $('#aaa').html(renderPaletteAAA(pairs, order));
  $('#aa').html(renderPaletteAA(pairs, order));
  $('#ui').html(renderPaletteUI(pairs, order));
  $('#fx').html(renderPaletteFX(pairs, order));
};

const render = () => {
  const palette = palettes[currentPalette];

  renderPalette(palette, currentOrder);
};

const renderPaletteOptions = () => {
  let html = '';

  Object.keys(palettes).forEach((key) => {
    html += `<option value="${key}">${palettes[key].name}</option>`;
  });

  return html;
};

const onChangePalette = (event) => {
  currentPalette = event.target.value;

  render();
};

const onSortPalette = (event) => {
  currentOrder = event.target.value;

  render();
};

Palette.build = () => {
  renderPalette(palettes.aap64);

  $('#palette-select').html(renderPaletteOptions());
  $('#palette-select').change(onChangePalette);
  $('#palette-sort').change(onSortPalette);
};

module.exports = Palette;
