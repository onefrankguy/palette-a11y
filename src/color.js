const Color = {};

const toHex = (value) => {
  const hex = value.toString(16);

  return hex.length > 1 ? hex : `0${hex}`;
}

const toHexColor = (r, g, b) => `${toHex(r)}${toHex(g)}${toHex(b)}`;

Color.luminance = ({r, g, b}) => {
  const sR = r / 255;
  const sG = g / 255;
  const sB = b / 255;

  const lR = sR <= 0.03928 ? sR / 12.92 : Math.pow((sR + 0.055) / 1.055, 2.4);
  const lG = sG <= 0.03928 ? sG / 12.92 : Math.pow((sG + 0.055) / 1.055, 2.4);
  const lB = sB <= 0.03928 ? sB / 12.92 : Math.pow((sB + 0.055) / 1.055, 2.4);

  return 0.2126 * lR + 0.7152 * lG + 0.0722 * lB;
};

Color.distance = (color1, color2) => {
  const rmean = (color1.r + color2.r) / 2;
  const dr = color1.r - color2.r;
  const dg = color1.g - color2.g;
  const db = color1.b - color2.b;
  const r = (2 + (rmean / 256)) * dr * dr;
  const g = 4 * dg * dg;
  const b = (2 + ((255 - rmean) / 256)) * db * db;

  return Math.sqrt(r + g + b);
};

Color.contrast = ({luminance: l1}, {luminance: l2}) => {
  const lighter = l1 > l2 ? l1 : l2;
  const darker = l1 < l2 ? l1 : l2;
  
  return (lighter + 0.05) / (darker + 0.05);
};

Color.blend = (color1, color2) => {
  let {r: srcR, g: srcG, b: srcB, a: srcA} = color1;
  let {r: dstR, g: dstG, b: dstB, a: dstA} = color2;

  if (!srcA && srcA !== 0) {
    srcA = 255;
  }
  if (!dstA && dstA !== 0) {
    dstA = 255;
  }

  srcR = srcR / 255;
  srcG = srcG / 255;
  srcB = srcB / 255;
  srcA = srcA / 255;

  dstR = dstR / 255;
  dstG = dstG / 255;
  dstB = dstB / 255;
  dstA = dstA / 255;

  const outA = srcA + (dstA * (1 - srcA));
  const outRGB = (src, dst) => {
    const value = ((src * srcA) + (dst * dstA * (1 - srcA))) / outA;

    return Math.max(0, Math.min(Math.floor(value * 256), 255));
  };

  const r = outRGB(srcR, dstR);
  const g = outRGB(srcG, dstG);
  const b = outRGB(srcB, dstB);
  const hexColor = toHexColor(r, g, b);

  return Color.parse(`#${hexColor}`);
};

Color.pairs = (foregroundColors, backgroundColors) => {
  const result = [];
  const tested = [];

  foregroundColors.forEach((foreground) => {
    backgroundColors.forEach((background) => {
      if (foreground.id !== background.id) {
        const pairId = `${foreground.id}-${background.id}`;

        if (!tested.includes(pairId)) {
          const contrast = Color.contrast(foreground, background);

          result.push({
            foreground,
            background,
            contrast,
          });

          tested.push(pairId);
        }
      }
    });
  });

  return result;
};

Color.parse = (value) => {
  if (typeof value === 'string') {
    if (value.startsWith('#')) {
      const r = parseInt(value.slice(1, 3), 16);
      const g = parseInt(value.slice(3, 5), 16);
      const b = parseInt(value.slice(5, 7), 16);

      return {
        id: value,
        r,
        g,
        b,
        luminance: Color.luminance({r, g, b}),
      };
    }
  }

  return undefined;
};

Color.BLACK = Color.parse('#000000');
Color.WHITE = Color.parse('#ffffff');

module.exports = Color;
