# @learn-ai-games/design-system

Shared CSS design system for all games in the Learn AI Through Games platform.

## Features

- Dark theme with vibrant accent colors
- CSS custom properties for consistent theming
- Responsive components
- Game-specific utilities

## Usage

All game HTML files link to this via:
```html
<link rel="stylesheet" href="/css/global.css">
```

## CSS Variables

### Colors
- `--bg-primary`: #0a0a0f (main background)
- `--bg-card`: #1a1a25 (card backgrounds)
- `--accent-green`: #00ff88 (primary accent)
- `--accent-blue`: #00a8ff (secondary accent)
- `--accent-purple`: #9d4edd (tertiary accent)

### Typography
- `--font-sans`: Inter, system fonts
- `--font-mono`: Fira Code, JetBrains Mono

### Spacing
- `--space-xs` through `--space-3xl`

### Shadows & Effects
- `--shadow-sm`, `--shadow-md`, `--shadow-lg`
- `--shadow-glow-green`, `--shadow-glow-blue`
