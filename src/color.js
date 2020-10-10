const Color = {};

Color.BLACK = {
  id: '#000000',
  r: 0,
  g: 0,
  b: 0,
};

Color.WHITE = {
  id: '#ffffff',
  r: 255,
  g: 255,
  b: 255,
};

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
  const g = 4 * dg;
  const b = (2 + ((255 - rmean) / 256)) * db * db;

  return Math.sqrt(r + g + b);
};

Color.contrast = (color1, color2) => {
  const l1 = Color.luminance(color1);
  const l2 = Color.luminance(color2);
  const lighter = l1 > l2 ? l1 : l2;
  const darker = l1 < l2 ? l1 : l2;
  
  return (lighter + 0.05) / (darker + 0.05);
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
      };
    }
  }

  return Color.BLACK;
};

module.exports = Color;
