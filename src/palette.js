const palettes = require('../palettes');
const $ = require('./jquery');
const Color = require('./color');

const Palette = {};

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

const renderContrastingPalette = (pairs, cutoff) => {
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

  Object.keys(passed).forEach((key) => {
    const pairs = passed[key];
    const background = pairs[0].background;

    html += `<div class="swatch background" style="background-color: ${background.id};">`;
    html += renderSwatch(background, 'swatch background label');

    pairs.forEach(({foreground}) => {
      html += renderSwatch(foreground);
    });

    html += `</div>`;
  });

  return html;
};

const renderPaletteAAA = (pairs) => renderContrastingPalette(pairs, (c) => c >= 7);
const renderPaletteAA = (pairs) => renderContrastingPalette(pairs, (c) => c < 7 && c >= 4.5);
const renderPaletteUI = (pairs) => renderContrastingPalette(pairs, (c) => c < 4.5 && c >= 3);
const renderPaletteFX = (pairs) => renderContrastingPalette(pairs, (c) => c < 3);

const renderPalette = (palette) => {
  const colors = palette.colors
    .map(Color.parse)
    .filter((color) => color);

  const pairs = Color.pairs(colors);

  $('#colors').html(renderPaletteColors(colors));
  $('#aaa').html(renderPaletteAAA(pairs));
  $('#aa').html(renderPaletteAA(pairs));
  $('#ui').html(renderPaletteUI(pairs));
  $('#fx').html(renderPaletteFX(pairs));
};

const renderPaletteOptions = () => {
  let html = '';

  Object.keys(palettes).forEach((key) => {
    html += `<option value="${key}">${palettes[key].name}</option>`;
  });

  return html;
};

const onChangePalette = (event) => {
  const palette = palettes[event.target.value];

  renderPalette(palette);
};

Palette.build = () => {
  renderPalette(palettes.aap64);

  $('#palette-select').html(renderPaletteOptions());
  $('#palette-select').change(onChangePalette);
};

module.exports = Palette;
