# Palette A11y #


## Credits ##

The animated octocat on [the site][] is from Tim Holman's [GitHub Corners][]
project. The [relative luminosity][] algorithm for colors is described in the
WCAG 2.1 techniques. The [color distance][] algorithm is the "redmean" one
discovered by Thiadmer Riemersma.

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

[the site]: https://onefrankguy.github.io/palette-a11y/ "Frank Mitchell (GitHub): Palette A11y"
[GitHub Corners]: https://tholman.com/github-corners/ "Tim Holman: GitHub Corners"
[relative luminosity]: https://www.w3.org/WAI/WCAG21/Techniques/general/G17 "Various (W3C): Web Content Accessibility Guidelines 2.1 - Techniques"
[color distance]: https://www.compuphase.com/cmetric.htm "Thiadmer Riemersma (CompuPhase): Colour metric"
[Node]: https://nodejs.org/ "Various (Node.js Foundation): Node.js is a JavaScript runtime built on Chrome's V8 JavaScript engine"
[NVM]: https://github.com/nvm-sh/nvm "Various (GitHub): Node Version Manager"
[LICENSE.md]: https://github.com/onefrankguy/palette-a11y/blob/main/LICENSE.md "Frank Mitchell (GitHub): MIT license for Palette A11y"
