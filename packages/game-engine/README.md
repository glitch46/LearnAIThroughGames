# @learn-ai-games/game-engine

Shared game engine providing XP system, achievements, and progress tracking for all games.

## Files

- `src/game-engine.js` - Core XP and achievement system
- `src/progress-tracker.js` - localStorage-based progress persistence

## Usage

All game HTML files include:
```html
<script src="/js/game-engine.js"></script>
<script src="/js/progress-tracker.js"></script>
```

## GameEngine API

### XP System
```javascript
GameEngine.awardXP(amount, reason);
GameEngine.getTotalXP();
GameEngine.getLevel();
```

### Achievements
```javascript
GameEngine.unlockAchievement(achievementId);
GameEngine.getAchievements();
GameEngine.hasAchievement(achievementId);
```

### Levels (25 achievements, 8 levels)
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

## ProgressTracker API

```javascript
ProgressTracker.saveProgress(gameId, data);
ProgressTracker.loadProgress(gameId);
ProgressTracker.clearProgress(gameId);
ProgressTracker.getAllProgress();
```
