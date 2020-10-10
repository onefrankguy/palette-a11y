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

const renderContrastingPalette = (colors, cutoff) => {
  let html = '';

  const tested = [];
  const passed = {};

  colors.forEach((foreground) => {
    colors.forEach((background) => {
      if (foreground.id !== background.id) {
        const pairId = `${foreground.id}-${background.id}`;
        
        if (!tested.includes(pairId)) {
          const contrast = Color.contrast(foreground, background);

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

          tested.push(pairId);
        }
      }
    });
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

const renderPaletteAAA = (colors) => renderContrastingPalette(colors, (c) => c >= 7);
const renderPaletteAA = (colors) => renderContrastingPalette(colors, (c) => c < 7 && c >= 4.5);
const renderPaletteUI = (colors) => renderContrastingPalette(colors, (c) => c < 4.5 && c >= 3);
const renderPaletteFX = (colors) => renderContrastingPalette(colors, (c) => c < 3);

const renderPalette = (palette) => {
  const colors = palette.colors
    .map(Color.parse)
    .filter((color) => color);

  $('#colors').html(renderPaletteColors(colors));
  $('#aaa').html(renderPaletteAAA(colors));
  $('#aa').html(renderPaletteAA(colors));
  $('#ui').html(renderPaletteUI(colors));
  $('#fx').html(renderPaletteFX(colors));
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
