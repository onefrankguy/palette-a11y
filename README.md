# Palette A11y #

While I was working on _[Dewdrop Farm][]_, I wanted a way to find accessible
color combinations. Most of the contrast checkers out there, like
[color.a11y.com][], focus on single pairs of colors. _Palette A11y_ checks a
palette of colors and groups them by accessibility. This makes it useful for
game or user interface design where you're working with a fixed set of colors.

_Palette A11y_ uses a [palette format][] defined in JSON. You can use
[pal2a11y.js][] to convert JASC .pal files into something _Palette A11y_ can
parse.

## Credits ##

The animated octocat on [the site][] is from Tim Holman's [GitHub Corners][]
project. The [relative luminosity][] algorithm for colors is described in the
notes about WCAG 2.1 techniques. The [color distance][] algorithm is the
"redmean" one discovered by Thiadmer Riemersma.

## Development ##

[Node][] versions are managed via [NVM][].

```bash
nvm install
npm install
```

The `dev` script will launch a development server on 127.0.0.1:3000.

```bash
npm run dev
```

The `build` script will package the project.

```bash
npm run build
```

## License ##

All code is licensed under a MIT license. See the [LICENSE.md][] file for more
details.


[Dewdrop Farm]: https://js13kgames.com/entries/dewdrop-farm "Frank Mitchell (js13kGames): Dewdrop Farm"
[color.a11y.com]: https://color.a11y.com/ContrastPair/ "Bureau of Internet Accessibility: Color-pair Contrast Testing"
[palette format]: https://github.com/onefrankguy/palette-a11y/blob/main/palettes/README.md "Frank Mitchell (GitHub): Palette format for Palette A11y"
[pal2a11y.js]: https://github.com/onefrankguy/palette-a11y/blob/main/palettes/pal2a11y.js "Frank Mitchell (GitHub): pal2a11y.js"
[the site]: https://onefrankguy.github.io/palette-a11y/ "Frank Mitchell (GitHub): Palette A11y"
[GitHub Corners]: https://tholman.com/github-corners/ "Tim Holman: GitHub Corners"
[relative luminosity]: https://www.w3.org/WAI/WCAG21/Techniques/general/G17 "Various (W3C): Web Content Accessibility Guidelines 2.1 - Techniques"
[color distance]: https://www.compuphase.com/cmetric.htm "Thiadmer Riemersma (CompuPhase): Colour metric"
[Node]: https://nodejs.org/ "Various (Node.js Foundation): Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine"
[NVM]: https://github.com/nvm-sh/nvm "Various (GitHub): Node Version Manager"
[LICENSE.md]: https://github.com/onefrankguy/palette-a11y/blob/main/LICENSE.md "Frank Mitchell (GitHub): MIT license for Palette A11y"
