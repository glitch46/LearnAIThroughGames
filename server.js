const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());

// Serve fonts
app.use('/fonts', express.static(path.join(__dirname, 'tools')));

// Serve audio files
app.use('/audio', express.static(path.join(__dirname, 'tools', 'audio')));

// Serve game assets (images, etc.)
app.use('/games/prompt-escape-rooms/assets', express.static(path.join(__dirname, 'apps', 'prompt-escape-rooms', 'assets')));

// Serve shared design system CSS
app.use('/css', express.static(path.join(__dirname, 'packages', 'design-system', 'css')));

// Serve shared game engine JS
app.use('/js', express.static(path.join(__dirname, 'packages', 'game-engine', 'src')));

// Serve data files
app.use('/data', express.static(path.join(__dirname, 'data')));

// ============================================
// GAMES HUB
// ============================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps', 'hub', 'index.html'));
});

app.get('/games', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps', 'hub', 'index.html'));
});

// ============================================
// INDIVIDUAL GAMES
// ============================================

// Terminal Velocity - CLI mastery
app.get('/games/terminal-velocity', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps', 'terminal-velocity', 'index.html'));
});

// Prompt Escape Rooms - Prompt engineering creativity
app.get('/games/prompt-escape-rooms', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps', 'prompt-escape-rooms', 'index.html'));
});

// Copy Pasta Chef - Code quality judgment
app.get('/games/copy-pasta-chef', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps', 'copy-pasta-chef', 'index.html'));
});

// Error Quest - Bug identification
app.get('/games/error-quest', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps', 'error-quest', 'index.html'));
});

// Prompt Battles - Weak vs strong prompts
app.get('/games/prompt-battles', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps', 'prompt-battles', 'index.html'));
});

// Build Races - Timed content creation
app.get('/games/build-races', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps', 'build-races', 'index.html'));
});

// AI Tool Olympics - Claude vs ChatGPT vs Gemini
app.get('/games/ai-tool-olympics', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps', 'ai-tool-olympics', 'index.html'));
});

// Architect's Blueprint - Product planning & strategy
app.get('/games/architects-blueprint', (req, res) => {
    res.sendFile(path.join(__dirname, 'apps', 'architects-blueprint', 'index.html'));
});

// ============================================
// API ENDPOINTS
// ============================================

// Get all games metadata
app.get('/api/games', (req, res) => {
    const games = [
        { id: 'terminal-velocity', name: 'Terminal Velocity', icon: '⚡', xp: 850, challenges: 10, category: 'CLI' },
        { id: 'prompt-escape-rooms', name: 'Prompt Escape Rooms', icon: '🗝️', xp: 500, challenges: 5, category: 'Prompting' },
        { id: 'copy-pasta-chef', name: 'Copy Pasta Chef', icon: '📖', xp: 750, challenges: 10, category: 'Quality' },
        { id: 'error-quest', name: 'Error Quest', icon: '⚠️', xp: 800, challenges: 10, category: 'Debugging' },
        { id: 'prompt-battles', name: 'Prompt Battles', icon: '⚔️', xp: 650, challenges: 10, category: 'Prompting' },
        { id: 'build-races', name: 'Build Races', icon: '🚀', xp: 900, challenges: 10, category: 'Speed' },
        { id: 'ai-tool-olympics', name: 'AI Tool Olympics', icon: '🏅', xp: 1000, challenges: 10, category: 'Comparison' },
        { id: 'architects-blueprint', name: "Architect's Blueprint", icon: '📐', xp: 1025, challenges: 10, category: 'Strategy' }
    ];
    res.json(games);
});

// Get player progress
app.get('/api/progress', (req, res) => {
    // This would typically read from a database
    // For now, return a placeholder that clients can override with localStorage
    res.json({
        totalXP: 0,
        level: 1,
        gamesCompleted: [],
        achievements: []
    });
});

// ============================================
// 404 HANDLER
// ============================================
app.use((req, res) => {
    res.status(404).send(`
        <html>
            <head><title>404 - Game Not Found</title></head>
            <body style="background: #0a0a0f; color: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
                <div style="text-align: center;">
                    <h1 style="font-size: 4rem; color: #00ff88;">404</h1>
                    <p>Game not found. <a href="/" style="color: #00ff88;">Return to Hub</a></p>
                </div>
            </body>
        </html>
    `);
});

// ============================================
// START SERVER
// ============================================
app.listen(PORT, '0.0.0.0', () => {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🎮 LEARN AI THROUGH GAMES                              ║
║   "Master AI by playing, not reading"                    ║
║                                                           ║
╠═══════════════════════════════════════════════════════════╣
║                                                           ║
║   Server: http://localhost:${PORT}                         ║
║                                                           ║
║   Games Hub:           /                                  ║
║   Terminal Velocity:   /games/terminal-velocity           ║
║   Prompt Escape Rooms: /games/prompt-escape-rooms         ║
║   Copy Pasta Chef:     /games/copy-pasta-chef             ║
║   Error Quest:         /games/error-quest                 ║
║   Prompt Battles:      /games/prompt-battles              ║
║   Build Races:         /games/build-races                 ║
║   AI Tool Olympics:    /games/ai-tool-olympics            ║
║   Architect's Blueprint: /games/architects-blueprint      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
});
