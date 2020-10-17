# Palette A11y Palettes #

You can see the following palettes on the _[Palette A11y][]_ site

* [Solarized][] by Ethan Schoonover
* [Color Universal Design][] by Mastaka Okabe and Kei Ito
* [AAP-64][] by Adigun A. Polack

[pal2a11y.js][] can be used to convert JASC .pal files into a JSON format
_Palette A11y_ can use. That format is described in [JSON Schema][] as

```json
{
  "$schema": "http://json-schema.org/schema#",
  "name": {
    "type": "string",
  },
  "colors": {
    "type": "array",
    "items": {
      "oneOf": [{
        "type": "string",
        "pattern": "^#[0-9a-fA-F]{6}$"
      }, {
        "type": "object",
        "properties": {
          "value": {
            "type": "string",
            "pattern": "^#[0-9a-fA-F]{6}$"
          },
          "token": {
            "type": "string"
          },
          "required": ["value"]
        }
      }]
    }
  }
}
```

Color values in a palette support optional "token" strings, allowing you to use
them with [design tokens][]. It's fine to have the same color show up multiple
times in a palette with different tokens.


[Palette A11y]: https://onefrankguy.github.io/palette-a11y/ "Frank Mitchell (GitHub): Palette A11y"
[Solarized]: https://ethanschoonover.com/solarized/ "Ethan Schoonover: Solarized"
[Color Universal Design]: https://jfly.uni-koeln.de/color/ "Mastaka Okabe and Kei Ito: Color Universal Design"
[AAP-64]: https://lospec.com/palette-list/aap-64 "Adigun A. Polack (Lowspec): AAP-64"
[pal2a11y.js]: https://github.com/onefrankguy/palette-a11y/blob/main/palettes/pal2a11y.js "Frank Mitchell (GitHub): pal2a11y.js"
[JSON Schema]: https://json-schema.org/ "JSON Schema is a vocabulary that allows you to annotate and validate JSON documents"
[design tokens]: https://www.smashingmagazine.com/2019/11/smashing-podcast-episode-3/ "Jina Anne & Drew McLellan (Smashing Magazine): What Are Design Tokens?"
