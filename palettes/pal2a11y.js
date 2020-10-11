#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const file = process.argv[2];
const data = fs.readFileSync(file).toString();
const lines = data.split("\n");
const output = {
  name: path.basename(file, '.pal'),
  colors: [],
};

const toHex = (value) => {
  const hex = value.toString(16);

  return hex.length > 1 ? hex : `0${hex}`;
}

const toHexColor = (r, g, b) => `${toHex(r)}${toHex(g)}${toHex(b)}`;

lines.forEach((rawLine) => {
  const line = rawLine.trim();
  const [rawR, rawG, rawB] = line.split(/\s+/);

  if (rawR && rawG && rawB) {
    const r = parseInt(rawR, 10);
    const g = parseInt(rawG, 10);
    const b = parseInt(rawB, 10);
    const hexColor = toHexColor(r, g, b);

    output.colors.push(`#${hexColor}`);
  }
});

console.log(JSON.stringify(output, null, 2));
