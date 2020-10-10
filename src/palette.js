const palettes = require('../palettes');
const $ = require('./jquery');
const Color = require('./color');

const Palette = {};

let currentPalette = palettes.aap64;
let currentOrder = 'index';
let pinnedColors = [];

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

  return `<span class="name ${klass}">${color.id}</span>`;
};

const renderSwatch = (color, klass = 'swatch') => {
  let html = '';

  html += `<div class="${klass}" style="background-color: ${color.id};" data-color="${color.id}">`;
  html += renderText(color);
  html += `</div>`;

  return html;
};

const renderPaletteColors = (colors, pinned) => {
  let html = '';

  colors.forEach((color) => {
    const klass = pinned.includes(color.id) ? 'swatch pinned' : 'swatch';

    html += renderSwatch(color, klass);
  });

  return html;
};

const renderContrastingPalette = (pairs, order, pinned, cutoff) => {
  let html = '';

  const passed = {};

  pairs.forEach(({foreground, background, contrast}) => {
    if (!pinned.length || pinned.includes(background.id)) {
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

const renderPaletteAAA = (pairs, order, pinned) => renderContrastingPalette(pairs, order, pinned, (c) => c >= 7);
const renderPaletteAA = (pairs, order, pinned) => renderContrastingPalette(pairs, order, pinned, (c) => c < 7 && c >= 4.5);
const renderPaletteUI = (pairs, order, pinned) => renderContrastingPalette(pairs, order, pinned, (c) => c < 4.5 && c >= 3);
const renderPaletteFX = (pairs, order, pinned) => renderContrastingPalette(pairs, order, pinned, (c) => c < 3);

const renderPalettes = (palette, order, pinned) => {
  const colors = palette.colors.slice()
    .map(Color.parse)
    .filter((color) => color)
    .sort(getSortFromOrder(order));

  const pairs = Color.pairs(colors);

  $('#colors').html(renderPaletteColors(colors, pinned));
  $('#aaa').html(renderPaletteAAA(pairs, order, pinned));
  $('#aa').html(renderPaletteAA(pairs, order, pinned));
  $('#ui').html(renderPaletteUI(pairs, order, pinned));
  $('#fx').html(renderPaletteFX(pairs, order, pinned));
};

const render = () => {
  renderPalettes(currentPalette, currentOrder, pinnedColors);
};

const renderPaletteOptions = () => {
  let html = '';

  Object.keys(palettes).forEach((key) => {
    html += `<option value="${key}">${palettes[key].name}</option>`;
  });

  return html;
};

const onChangePalette = (event) => {
  currentPalette = palettes[event.target.value];
  pinnedColors = [];

  render();
};

const onSortPalette = (event) => {
  currentOrder = event.target.value;

  render();
};

const onClickColor = (event) => {
  let element = event.target;

  while (element && !element.dataset.color) {
    element = element.parentElement;
  }

  if (element && element.dataset.color) {
    const color = element.dataset.color;

    if (pinnedColors.includes(color)) {
      pinnedColors = pinnedColors.filter((c) => c !== color);
    } else {
      pinnedColors.push(color);
    }

    render();
  }
};

Palette.build = () => {
  $('#palette-select').html(renderPaletteOptions());
  $('#palette-select').change(onChangePalette);
  $('#palette-sort').change(onSortPalette);
  $('#colors').click(onClickColor);

  render();
};

module.exports = Palette;
