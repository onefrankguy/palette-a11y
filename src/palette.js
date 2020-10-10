const palettes = require('../palettes');
const $ = require('./jquery');
const Color = require('./color');

const Palette = {};

const renderPaletteColors = (colors) => {
  let html = '';

  colors.forEach((color) => {
    const c = Color.parse(color);
    const blackContrast = Color.contrast(c, Color.BLACK);
    const whiteContrast = Color.contrast(c, Color.WHITE);
    const textColor = blackContrast > whiteContrast ? 'black' : 'white';

    html += `<div class="swatch" style="background-color: ${c.id};">`;
    html += `<span class="${textColor}">${c.id}</span>`;
    html += `</div>`;
  });

  return html;
};

const renderPalette = (palette) => {
  $('#colors').html(renderPaletteColors(palette.colors));
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
