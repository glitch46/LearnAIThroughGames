# 🎮 Learn AI Through Games

**Master AI development through interactive games** - CLI mastery, prompt engineering, debugging, and strategic thinking.

## Quick Start

```bash
# Install dependencies
npm install

# Start the server
npm run dev

# Open in browser
open http://localhost:3002
```

## 🕹️ Games (8 Total)

| Game | Category | XP | Description |
|------|----------|-----|-------------|
| ⚡ **Terminal Velocity** | CLI | 850 | Master terminal commands through 10 progressively harder levels |
| 🗝️ **Prompt Escape Rooms** | Prompting | 500 | Solve puzzles using creative prompt engineering |
| 📖 **Copy Pasta Chef** | Quality | 750 | Judge code quality - keep the good, reject the bad |
| ⚠️ **Error Quest** | Debugging | 800 | Identify and fix bugs in AI-generated code |
| ⚔️ **Prompt Battles** | Prompting | 650 | Compare weak vs strong prompts, learn the difference |
| 🚀 **Build Races** | Speed | 900 | Timed challenges to build content with AI assistance |
| 🏅 **AI Tool Olympics** | Comparison | 1000 | Claude vs ChatGPT vs Gemini - learn each tool's strengths |
| 📐 **Architect's Blueprint** | Strategy | 1025 | Product planning and system design challenges |

**Total XP Available:** 6,475+

## 📁 Project Structure

```
LearnAIThroughGames/
├── apps/                    # Individual games
│   ├── hub/                 # Games Hub (home page)
│   ├── terminal-velocity/
│   ├── prompt-escape-rooms/
│   ├── copy-pasta-chef/
│   ├── error-quest/
│   ├── prompt-battles/
│   ├── build-races/
│   ├── ai-tool-olympics/
│   └── architects-blueprint/
│
├── packages/                # Shared code
│   ├── design-system/       # CSS variables, components
│   │   └── css/global.css
│   └── game-engine/         # XP, achievements, progress
│       └── src/
│           ├── game-engine.js
│           └── progress-tracker.js
│
├── data/                    # Game content (JSON)
│   ├── commands/            # CLI commands data
│   ├── challenges/          # Game challenges
│   └── scenarios/           # Escape room scenarios
│
├── server.js                # Express server
├── package.json             # Root workspace config
└── README.md
```

## 🎯 XP & Leveling System

| Level | XP Required | Title |
|-------|-------------|-------|
| 1 | 0 | Neophyte |
| 2 | 100 | Prompt Apprentice |
| 3 | 250 | Agent Tinkerer |
| 4 | 500 | Code Whisperer |
| 5 | 1000 | Orchestrator |
| 6 | 2000 | AI Architect |
| 7 | 4000 | System Master |
| 8 | 8000 | AI Grandmaster |

## 🏆 Achievements (25 Total)

- **First Blood** - Complete your first challenge
- **Speed Demon** - Finish a timed challenge under par
- **Prompt Master** - Score 100% on any prompting game
- **Bug Hunter** - Find 10 bugs in Error Quest
- **CLI Ninja** - Complete Terminal Velocity
- **Full Stack** - Complete all 8 games
- *...and 19 more*

## 🛠️ Development

### Adding a New Game

1. Create folder in `apps/your-game-name/`
2. Add `index.html` with standard structure
3. Link to shared CSS/JS:
   ```html
   <link rel="stylesheet" href="/css/global.css">
   <script src="/js/game-engine.js"></script>
   <script src="/js/progress-tracker.js"></script>
   ```
4. Add route in `server.js`
5. Add game data JSON in `data/challenges/`

### Design System

All games use the shared design system. Key CSS variables:
- `--bg-primary`, `--bg-card` - Backgrounds
- `--accent-green`, `--accent-blue`, `--accent-purple` - Accents
- `--text-primary`, `--text-secondary` - Text colors

## 🚦 Safe Deploy Workflow

When this repo auto-deploys from GitHub (Hostinger), always run these commands before pushing:

```bash
git fetch origin --prune
git pull --ff-only origin main
npm ci
npm test
```

If `npm test` fails, do not push. Fix the issue locally first.

What `npm test` validates:
- Home routes (`/`, `/games`) return HTTP 200 and HTML
- Core game route (`/games/prompt-escape-rooms`) returns HTTP 200
- API route (`/api/games`) returns valid JSON array
- Critical static assets (hub lock icon, favicon) are served

## 📜 License

MIT

---

**Part of the AI Mastery Bootcamp** - *"Stop learning to code. Start learning to create."*
