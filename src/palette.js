const palettes = require('../palettes');
const $ = require('./jquery');
const Color = require('./color');

const Palette = {};

let currentPalette = palettes[0];
let currentOrder = 'index';
let currentOpacity = 100;
let pinnedColors = [];
let parsedPalette = currentPalette.colors.map(Color.parse);

const sortByIndex = (color1, color2) => {
  const index1 = parsedPalette.findIndex((c) => c.id === color1.id);
  const index2 = parsedPalette.findIndex((c) => c.id === color2.id);

  if (index1 < index2) {
    return -1;
  }
  if (index2 > index1) {
    return 1;
  }
  return 0;
};

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

const renderSwatch = (color, klass) => {
  let html = '';

  html += `<div class="${klass}" style="background-color: ${color.id};" data-color="${color.id}">`;
  html += renderText(color);
  html += `</div>`;

  return html;
};

const renderExample = (color) => {
  let html = '';

  html += '<div class="swatch">';
  html += renderSwatch(color, 'swatch button');
  html += `<div class="swatch text" style="color: ${color.id};">`;
  color.tokens.forEach((token) => {
    html += `<span>${token}</span>`;
  });
  html += `</div>`;
  html += '</div>';

  return html;
};

const renderPaletteColors = (colors, pinned) => {
  let html = '';

  colors.forEach((color) => {
    const klass = pinned.includes(color.id) ? 'swatch select pinned' : 'swatch select';

    html += renderSwatch(color, klass);
  });

  return html;
};

const renderContrastingPalette = (pairs, order, cutoff) => {
  let html = '';

  const passed = {};

  pairs.forEach(({foreground, background, contrast}) => {
    if (cutoff(contrast)) {
      if (!passed[background.uuid]) {
        passed[background.uuid] = [];
      }
      passed[background.uuid].push({
        foreground,
        background,
        contrast,
      });
    }
  });

  const sort = getSortFromOrder(order);
  const sortedPairs = Object.keys(passed)
    .sort((color1, color2) => {
      const c1 = passed[color1][0].background;
      const c2 = passed[color2][0].background;

      return sort(c1, c2);
    })
    .map((key) => passed[key])

  sortedPairs.forEach((pairs) => {
    const background = pairs[0].background;

    pairs.sort((color1, color2) => {
      const c1 = sort(color1, background);
      const c2 = sort(color2, background);

      return c1 - c2;
    });

    html += `<div class="swatch background" style="background-color: ${background.id};">`;
    html += renderSwatch(background, 'swatch background');

    pairs.forEach(({foreground}) => {
      html += renderExample(foreground);
    });

    html += `</div>`;
  });

  return html;
};

const renderPaletteAAA = (pairs, order) => renderContrastingPalette(pairs, order, (c) => c >= 7);
const renderPaletteAA = (pairs, order) => renderContrastingPalette(pairs, order, (c) => c < 7 && c >= 4.5);
const renderPaletteUI = (pairs, order) => renderContrastingPalette(pairs, order, (c) => c < 4.5 && c >= 3);
const renderPaletteFX = (pairs, order) => renderContrastingPalette(pairs, order, (c) => c < 3);

const renderPalettes = (palette, order, opacity, pinned) => {
  const sort = getSortFromOrder(order);
  const parsedColors = palette.colors.slice()
    .map(Color.parse)
    .filter((color) => color);
 
  const foregroundColors = Color.unique(parsedColors)
    .sort(sort);

  const backgroundColors = pinned.slice()
    .map(Color.parse)
    .filter((color) => color)
    .map((color) => {
      const c = Color.blend({
        ...color,
        a: opacity,
      }, Color.WHITE);

      return {
        ...c,
        uuid: color.id,
      };
    });

  const pairs = Color.pairs(foregroundColors, backgroundColors);

  $('#colors').html(renderPaletteColors(foregroundColors, pinned));
  $('#aaa').html(renderPaletteAAA(pairs, order));
  $('#aa').html(renderPaletteAA(pairs, order));
  $('#ui').html(renderPaletteUI(pairs, order));
  $('#fx').html(renderPaletteFX(pairs, order));
};

const render = () => {
  requestAnimationFrame(() => {
    const opacity = Color.clamp(currentOpacity / 100);

    renderPalettes(currentPalette, currentOrder, opacity, pinnedColors);
  });
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
  parsedPalette = currentPalette.colors.map(Color.parse);

  render();
};

const onSortPalette = (event) => {
  currentOrder = event.target.value;

  render();
};

const onChangeOpacity = (event) => {
  currentOpacity = parseInt(event.target.value, 10);

  $('#opacity').html(`${currentOpacity}%`);

  render();
};

const onInputOpacity = (event) => {
  currentOpacity = parseInt(event.target.value, 10);

  $('#opacity').html(`${currentOpacity}%`);
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
  $('#palette-opacity').change(onChangeOpacity);
  $('#palette-opacity').input(onInputOpacity);
  $('#colors').click(onClickColor);

  render();
};

module.exports = Palette;
