# General Purpose

A custom [Ghost](https://ghost.org/) theme for Jess Holbrook's personal site.

## Design

Centered, single-column editorial layout with a Frost White (`#FBFAF2`) palette and Lora serif typography. Features gold-highlighted link underlines, dark mode with system preference detection, and a minimal top navigation bar.

## Pages

- **Blog** -- Post listing and individual article pages
- **Publications** -- Academic papers and research
- **Products** -- Card grid of products built or contributed to
- **Experiments** -- Card grid of web experiments and side projects
- **About** -- Bio and background

## Development

Requires [Node.js](https://nodejs.org/) and a local [Ghost](https://ghost.org/docs/install/) instance.

```bash
# Install dependencies
npm install

# Development with live reload
npm run dev

# Production build
npm run build

# Validate theme
npm test

# Package for upload
npm run zip
```

## Stack

- **CMS**: Ghost >= 6.0.0
- **Templates**: Handlebars
- **Styles**: PostCSS with postcss-preset-env
- **Build**: Rollup

## License

MIT
