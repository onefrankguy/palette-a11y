# Palette A11y Palettes #

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

[pal2a11y.js]: https://github.com/onefrankguy/palette-a11y/blob/main/palettes/pal2a11y.js "Frank Mitchell (GitHub): pal2a11y.js"
[JSON Schema]: https://json-schema.org/ "JSON Schema is a vocabulary that allows you to annotate and validate JSON documents"
