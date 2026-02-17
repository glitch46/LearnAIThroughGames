/**
 * AI MASTERY BOOTCAMP - Game Engine
 * Handles XP, achievements, scoring, and game utilities
 */

const GameEngine = (() => {
    
    // Achievement definitions
    const ACHIEVEMENTS = {
        // Milestone badges
        'first-steps': {
            id: 'first-steps',
            name: 'First Steps',
            description: 'Complete Day 1',
            icon: '🎯',
            xp: 50
        },
        'week-warrior': {
            id: 'week-warrior',
            name: 'Week Warrior',
            description: 'Complete Week 1',
            icon: '⚔️',
            xp: 200
        },
        'halfway-hero': {
            id: 'halfway-hero',
            name: 'Halfway Hero',
            description: 'Complete Week 2',
            icon: '🦸',
            xp: 300
        },
        'final-stretch': {
            id: 'final-stretch',
            name: 'Final Stretch',
            description: 'Complete Week 3',
            icon: '🏃',
            xp: 400
        },
        'graduate': {
            id: 'graduate',
            name: 'Graduate',
            description: 'Complete the bootcamp',
            icon: '🎓',
            xp: 500
        },
        
        // Game badges
        'matrix-escapee': {
            id: 'matrix-escapee',
            name: 'Matrix Escapee',
            description: 'Complete Terminal Velocity',
            icon: '🔓',
            xp: 150
        },
        'escape-artist': {
            id: 'escape-artist',
            name: 'Escape Artist',
            description: 'Complete all Prompt Escape Rooms',
            icon: '🗝️',
            xp: 200
        },
        'battle-champion': {
            id: 'battle-champion',
            name: 'Battle Champion',
            description: 'Win 10 Prompt Battles',
            icon: '⚡',
            xp: 100
        },
        'speed-demon': {
            id: 'speed-demon',
            name: 'Speed Demon',
            description: 'Complete any Build Race under target time',
            icon: '🚀',
            xp: 150
        },
        'bug-hunter': {
            id: 'bug-hunter',
            name: 'Bug Hunter',
            description: 'Complete all Error Quest challenges',
            icon: '🐛',
            xp: 200
        },
        'olympian': {
            id: 'olympian',
            name: 'Olympian',
            description: 'Complete AI Tool Olympics',
            icon: '🏅',
            xp: 100
        },
        'master-planner': {
            id: 'master-planner',
            name: 'Master Planner',
            description: 'Complete The Architect\'s Blueprint',
            icon: '📐',
            xp: 150
        },
        'code-reader': {
            id: 'code-reader',
            name: 'Code Reader',
            description: 'Complete Copy Pasta Chef',
            icon: '📖',
            xp: 100
        },
        
        // Special badges
        'streak-keeper': {
            id: 'streak-keeper',
            name: 'Streak Keeper',
            description: '7-day learning streak',
            icon: '🔥',
            xp: 100
        },
        'early-bird': {
            id: 'early-bird',
            name: 'Early Bird',
            description: 'Complete a lesson before 8 AM',
            icon: '🌅',
            xp: 50
        },
        'night-owl': {
            id: 'night-owl',
            name: 'Night Owl',
            description: 'Complete a lesson after 10 PM',
            icon: '🦉',
            xp: 50
        },
        'perfectionist': {
            id: 'perfectionist',
            name: 'Perfectionist',
            description: 'Score 100% on any game',
            icon: '💯',
            xp: 100
        },
        'speedrunner': {
            id: 'speedrunner',
            name: 'Speedrunner',
            description: 'Complete bootcamp in under 3 weeks',
            icon: '⏱️',
            xp: 300
        },
        'explorer': {
            id: 'explorer',
            name: 'Explorer',
            description: 'Find 3 easter eggs',
            icon: '🔍',
            xp: 150
        },
        'comeback-kid': {
            id: 'comeback-kid',
            name: 'Comeback Kid',
            description: 'Resume after 3+ day break',
            icon: '💪',
            xp: 75
        }
    };
    
    // Level thresholds
    const LEVELS = [
        { level: 1, xp: 0, title: 'Curious Beginner' },
        { level: 2, xp: 150, title: 'Prompt Apprentice' },
        { level: 3, xp: 400, title: 'Code Whisperer' },
        { level: 4, xp: 750, title: 'Tool Wielder' },
        { level: 5, xp: 1200, title: 'Vibe Coder' },
        { level: 6, xp: 1800, title: 'Application Architect' },
        { level: 7, xp: 2500, title: 'AI Native' },
        { level: 8, xp: 3500, title: 'Shipping Legend' }
    ];
    
    /**
     * Award XP to the player
     */
    function awardXP(amount, reason = '') {
        const progress = getProgress();
        const oldLevel = getCurrentLevel();
        
        progress.totalXP += amount;
        progress.history.push({
            timestamp: Date.now(),
            xp: amount,
            reason: reason
        });
        
        saveProgress(progress);
        
        const newLevel = getCurrentLevel();
        
        // Show XP notification
        showXPNotification(amount, reason);
        
        // Check for level up
        if (newLevel > oldLevel) {
            showLevelUpNotification(newLevel);
        }
        
        // Dispatch event for other components
        window.dispatchEvent(new CustomEvent('xpAwarded', { 
            detail: { amount, reason, newTotal: progress.totalXP } 
        }));
        
        return progress.totalXP;
    }
    
    /**
     * Unlock an achievement
     */
    function unlockAchievement(achievementId) {
        const achievement = ACHIEVEMENTS[achievementId];
        if (!achievement) {
            console.warn(`Achievement ${achievementId} not found`);
            return;
        }
        
        const progress = getProgress();
        
        // Check if already unlocked
        if (progress.achievements.includes(achievementId)) {
            return;
        }
        
        // Add to unlocked achievements
        progress.achievements.push(achievementId);
        progress.achievementUnlockDates[achievementId] = Date.now();
        saveProgress(progress);
        
        // Award XP
        awardXP(achievement.xp, `Achievement: ${achievement.name}`);
        
        // Show achievement notification
        showAchievementNotification(achievement);
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('achievementUnlocked', { 
            detail: achievement 
        }));
    }
    
    /**
     * Get current level based on XP
     */
    function getCurrentLevel() {
        const xp = getProgress().totalXP;
        let level = 1;
        
        for (const levelData of LEVELS) {
            if (xp >= levelData.xp) {
                level = levelData.level;
            } else {
                break;
            }
        }
        
        return level;
    }
    
    /**
     * Get current level title
     */
    function getLevelTitle() {
        const level = getCurrentLevel();
        const levelData = LEVELS.find(l => l.level === level);
        return levelData ? levelData.title : 'Unknown';
    }
    
    /**
     * Get XP progress to next level
     */
    function getXPToNextLevel() {
        const currentXP = getProgress().totalXP;
        const currentLevel = getCurrentLevel();
        const nextLevelData = LEVELS.find(l => l.level === currentLevel + 1);
        
        if (!nextLevelData) {
            return { current: currentXP, needed: currentXP, percentage: 100 };
        }
        
        const currentLevelData = LEVELS.find(l => l.level === currentLevel);
        const baseXP = currentLevelData.xp;
        const neededXP = nextLevelData.xp;
        const progressXP = currentXP - baseXP;
        const totalNeeded = neededXP - baseXP;
        const percentage = Math.floor((progressXP / totalNeeded) * 100);
        
        return {
            current: progressXP,
            needed: totalNeeded,
            percentage: Math.min(percentage, 100)
        };
    }
    
    /**
     * Get or initialize progress data
     */
    function getProgress() {
        const stored = localStorage.getItem('bootcamp-progress');
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Initialize new progress
        const newProgress = {
            totalXP: 0,
            achievements: [],
            achievementUnlockDates: {},
            gamesCompleted: [],
            lessonsCompleted: [],
            dailyActivity: {},
            currentStreak: 0,
            longestStreak: 0,
            lastActiveDate: null,
            startDate: Date.now(),
            history: [],
            easterEggsFound: []
        };
        
        saveProgress(newProgress);
        return newProgress;
    }
    
    /**
     * Save progress to localStorage
     */
    function saveProgress(progress) {
        localStorage.setItem('bootcamp-progress', JSON.stringify(progress));
    }
    
    /**
     * Mark a game as completed
     */
    function completeGame(gameId, score = 0) {
        const progress = getProgress();
        
        if (!progress.gamesCompleted.includes(gameId)) {
            progress.gamesCompleted.push(gameId);
        }
        
        // Store high score
        if (!progress.gameScores) progress.gameScores = {};
        if (!progress.gameScores[gameId] || score > progress.gameScores[gameId]) {
            progress.gameScores[gameId] = score;
        }
        
        saveProgress(progress);
        
        // Dispatch event
        window.dispatchEvent(new CustomEvent('gameCompleted', { 
            detail: { gameId, score } 
        }));
    }
    
    /**
     * Mark a lesson as completed
     */
    function completeLesson(lessonId) {
        const progress = getProgress();
        
        if (!progress.lessonsCompleted.includes(lessonId)) {
            progress.lessonsCompleted.push(lessonId);
            updateDailyActivity();
            saveProgress(progress);
            
            // Dispatch event
            window.dispatchEvent(new CustomEvent('lessonCompleted', { 
                detail: { lessonId } 
            }));
        }
    }
    
    /**
     * Update daily activity and streak
     */
    function updateDailyActivity() {
        const progress = getProgress();
        const today = new Date().toDateString();
        
        // Mark today as active
        if (!progress.dailyActivity[today]) {
            progress.dailyActivity[today] = {
                date: today,
                xpEarned: 0,
                lessonsCompleted: 0
            };
        }
        
        progress.dailyActivity[today].lessonsCompleted++;
        
        // Update streak
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toDateString();
        
        if (progress.lastActiveDate === yesterdayStr || progress.lastActiveDate === today) {
            // Continue streak
            if (progress.lastActiveDate !== today) {
                progress.currentStreak++;
            }
        } else if (!progress.lastActiveDate) {
            // First day
            progress.currentStreak = 1;
        } else {
            // Streak broken
            progress.currentStreak = 1;
        }
        
        progress.lastActiveDate = today;
        
        // Update longest streak
        if (progress.currentStreak > progress.longestStreak) {
            progress.longestStreak = progress.currentStreak;
        }
        
        // Check for streak achievement
        if (progress.currentStreak === 7) {
            unlockAchievement('streak-keeper');
        }
        
        saveProgress(progress);
    }
    
    /**
     * Record easter egg discovery
     */
    function foundEasterEgg(eggId) {
        const progress = getProgress();
        
        if (!progress.easterEggsFound.includes(eggId)) {
            progress.easterEggsFound.push(eggId);
            saveProgress(progress);
            
            awardXP(25, 'Easter egg discovered!');
            
            // Check for explorer achievement
            if (progress.easterEggsFound.length >= 3) {
                unlockAchievement('explorer');
            }
        }
    }
    
    /**
     * Show XP notification
     */
    function showXPNotification(amount, reason) {
        const notification = document.createElement('div');
        notification.className = 'xp-notification';
        notification.innerHTML = `
            <div class="xp-amount">+${amount} XP</div>
            ${reason ? `<div class="xp-reason">${reason}</div>` : ''}
        `;
        
        document.body.appendChild(notification);
        
        // Add styles if not already present
        if (!document.getElementById('game-engine-styles')) {
            const styles = document.createElement('style');
            styles.id = 'game-engine-styles';
            styles.textContent = `
                .xp-notification {
                    position: fixed;
                    top: 100px;
                    right: 30px;
                    background: var(--bg-card, #1a1a25);
                    border: 2px solid var(--accent-green, #00ff88);
                    border-radius: 12px;
                    padding: 15px 20px;
                    z-index: 1000;
                    animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s;
                    pointer-events: none;
                }
                
                .xp-amount {
                    font-size: 1.5rem;
                    font-weight: 700;
                    color: var(--accent-green, #00ff88);
                    font-family: 'Fira Code', monospace;
                }
                
                .xp-reason {
                    font-size: 0.85rem;
                    color: var(--text-secondary, #a0a0b0);
                    margin-top: 5px;
                }
                
                .achievement-notification {
                    position: fixed;
                    top: 100px;
                    right: 30px;
                    background: var(--bg-card, #1a1a25);
                    border: 2px solid var(--accent-yellow, #ffd60a);
                    border-radius: 16px;
                    padding: 20px;
                    z-index: 1001;
                    min-width: 300px;
                    box-shadow: 0 0 40px rgba(255, 214, 10, 0.3);
                    animation: achievementSlide 0.5s ease, fadeOut 0.3s ease 4.7s;
                    pointer-events: none;
                }
                
                .achievement-header {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-bottom: 10px;
                }
                
                .achievement-icon {
                    font-size: 2.5rem;
                }
                
                .achievement-title {
                    color: var(--accent-yellow, #ffd60a);
                    font-weight: 700;
                    font-size: 1.1rem;
                    margin: 0 0 5px 0;
                }
                
                .achievement-description {
                    color: var(--text-secondary, #a0a0b0);
                    font-size: 0.9rem;
                    margin: 0;
                }
                
                .level-up-notification {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--bg-card, #1a1a25);
                    border: 3px solid var(--accent-green, #00ff88);
                    border-radius: 20px;
                    padding: 40px;
                    z-index: 1002;
                    text-align: center;
                    min-width: 400px;
                    box-shadow: 0 0 60px rgba(0, 255, 136, 0.4);
                    animation: popIn 0.5s ease, fadeOut 0.3s ease 3.7s;
                }
                
                .level-up-title {
                    font-size: 2.5rem;
                    font-weight: 700;
                    background: linear-gradient(135deg, #00ff88, #00a8ff);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    margin-bottom: 20px;
                }
                
                .level-up-level {
                    font-size: 4rem;
                    font-weight: 700;
                    color: var(--accent-green, #00ff88);
                    font-family: 'Fira Code', monospace;
                    margin: 20px 0;
                }
                
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(100px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes achievementSlide {
                    from {
                        opacity: 0;
                        transform: translateX(100px) rotate(5deg);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0) rotate(0);
                    }
                }
                
                @keyframes popIn {
                    from {
                        opacity: 0;
                        transform: translate(-50%, -50%) scale(0.8);
                    }
                    to {
                        opacity: 1;
                        transform: translate(-50%, -50%) scale(1);
                    }
                }
                
                @keyframes fadeOut {
                    to {
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(styles);
        }
        
        // Remove after animation
        setTimeout(() => notification.remove(), 3000);
    }
    
    /**
     * Show achievement unlock notification
     */
    function showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-notification';
        notification.innerHTML = `
            <div class="achievement-header">
                <div class="achievement-icon">${achievement.icon}</div>
                <div>
                    <h4 class="achievement-title">Achievement Unlocked!</h4>
                    <p class="achievement-description">${achievement.name}</p>
                </div>
            </div>
            <p class="achievement-description">${achievement.description}</p>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 5000);
        
        // Play sound if available
        playSound('achievement');
    }
    
    /**
     * Show level up notification
     */
    function showLevelUpNotification(newLevel) {
        const levelData = LEVELS.find(l => l.level === newLevel);
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-title">LEVEL UP!</div>
            <div class="level-up-level">Level ${newLevel}</div>
            <p style="color: var(--text-secondary); font-size: 1.2rem;">${levelData.title}</p>
        `;
        
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 4000);
        
        // Play sound if available
        playSound('levelup');
    }
    
    /**
     * Play sound effect (if audio files exist)
     */
    function playSound(soundName) {
        try {
            const audio = new Audio(`/assets/sounds/${soundName}.mp3`);
            audio.volume = 0.3;
            audio.play().catch(() => {}); // Ignore errors if file doesn't exist
        } catch (e) {
            // Sounds are optional
        }
    }
    
    /**
     * Format time in MM:SS
     */
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    /**
     * Create a simple timer
     */
    function createTimer(onTick) {
        let seconds = 0;
        let interval = null;
        
        return {
            start() {
                interval = setInterval(() => {
                    seconds++;
                    if (onTick) onTick(seconds);
                }, 1000);
            },
            stop() {
                if (interval) {
                    clearInterval(interval);
                    interval = null;
                }
                return seconds;
            },
            getTime() {
                return seconds;
            },
            reset() {
                seconds = 0;
            }
        };
    }
    
    // Public API
    return {
        awardXP,
        unlockAchievement,
        getCurrentLevel,
        getLevelTitle,
        getXPToNextLevel,
        getProgress,
        saveProgress,
        completeGame,
        completeLesson,
        updateDailyActivity,
        foundEasterEgg,
        formatTime,
        createTimer,
        ACHIEVEMENTS,
        LEVELS
    };
})();

// Make available globally
window.GameEngine = GameEngine;
