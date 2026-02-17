/**
 * AI MASTERY BOOTCAMP - Progress Tracker
 * Syncs progress across all pages and provides UI updates
 */

const ProgressTracker = (() => {
    
    /**
     * Initialize progress tracking on page load
     */
    function init() {
        updateAllDisplays();
        setupEventListeners();
        checkTimeAchievements();
    }
    
    /**
     * Update all progress displays on the page
     */
    function updateAllDisplays() {
        updateXPDisplay();
        updateLevelDisplay();
        updateStreakDisplay();
        updateProgressBars();
        updateCompletionStats();
    }
    
    /**
     * Update XP display elements
     */
    function updateXPDisplay() {
        const progress = GameEngine.getProgress();
        const xpElements = document.querySelectorAll('[data-xp]');
        
        xpElements.forEach(el => {
            el.textContent = progress.totalXP.toLocaleString();
        });
    }
    
    /**
     * Update level display elements
     */
    function updateLevelDisplay() {
        const level = GameEngine.getCurrentLevel();
        const title = GameEngine.getLevelTitle();
        
        const levelElements = document.querySelectorAll('[data-level]');
        levelElements.forEach(el => {
            el.textContent = level;
        });
        
        const titleElements = document.querySelectorAll('[data-level-title]');
        titleElements.forEach(el => {
            el.textContent = title;
        });
    }
    
    /**
     * Update streak display elements
     */
    function updateStreakDisplay() {
        const progress = GameEngine.getProgress();
        const streakElements = document.querySelectorAll('[data-streak]');
        
        streakElements.forEach(el => {
            el.textContent = progress.currentStreak;
        });
    }
    
    /**
     * Update progress bars
     */
    function updateProgressBars() {
        const xpProgress = GameEngine.getXPToNextLevel();
        const progressBars = document.querySelectorAll('[data-progress-bar]');
        
        progressBars.forEach(bar => {
            const fill = bar.querySelector('.progress-fill');
            if (fill) {
                fill.style.width = xpProgress.percentage + '%';
            }
            
            // Update text if present
            const text = bar.querySelector('[data-progress-text]');
            if (text) {
                text.textContent = `${xpProgress.current} / ${xpProgress.needed} XP`;
            }
        });
    }
    
    /**
     * Update completion statistics
     */
    function updateCompletionStats() {
        const progress = GameEngine.getProgress();
        
        // Update lessons completed
        const lessonsElements = document.querySelectorAll('[data-lessons-completed]');
        lessonsElements.forEach(el => {
            el.textContent = progress.lessonsCompleted.length;
        });
        
        // Update games completed
        const gamesElements = document.querySelectorAll('[data-games-completed]');
        gamesElements.forEach(el => {
            el.textContent = progress.gamesCompleted.length;
        });
        
        // Update achievements unlocked
        const achievementsElements = document.querySelectorAll('[data-achievements-unlocked]');
        achievementsElements.forEach(el => {
            el.textContent = progress.achievements.length;
        });
    }
    
    /**
     * Setup event listeners for progress updates
     */
    function setupEventListeners() {
        // Listen for XP awards
        window.addEventListener('xpAwarded', () => {
            updateAllDisplays();
        });
        
        // Listen for achievements
        window.addEventListener('achievementUnlocked', () => {
            updateAllDisplays();
        });
        
        // Listen for game completions
        window.addEventListener('gameCompleted', () => {
            updateAllDisplays();
        });
        
        // Listen for lesson completions
        window.addEventListener('lessonCompleted', () => {
            updateAllDisplays();
        });
        
        // Listen for storage changes (cross-tab sync)
        window.addEventListener('storage', (e) => {
            if (e.key === 'bootcamp-progress') {
                updateAllDisplays();
            }
        });
    }
    
    /**
     * Check for time-based achievements
     */
    function checkTimeAchievements() {
        const hour = new Date().getHours();
        
        // Early bird (before 8 AM)
        if (hour < 8) {
            const progress = GameEngine.getProgress();
            if (!progress.achievements.includes('early-bird')) {
                GameEngine.unlockAchievement('early-bird');
            }
        }
        
        // Night owl (after 10 PM)
        if (hour >= 22) {
            const progress = GameEngine.getProgress();
            if (!progress.achievements.includes('night-owl')) {
                GameEngine.unlockAchievement('night-owl');
            }
        }
    }
    
    /**
     * Get completion percentage for a specific week
     */
    function getWeekCompletion(weekNumber) {
        const progress = GameEngine.getProgress();
        const lessonsPerWeek = 5;
        const weekLessons = [];
        
        for (let i = 1; i <= lessonsPerWeek; i++) {
            weekLessons.push(`week${weekNumber}-day${i}`);
        }
        
        const completed = weekLessons.filter(lesson => 
            progress.lessonsCompleted.includes(lesson)
        ).length;
        
        return Math.floor((completed / lessonsPerWeek) * 100);
    }
    
    /**
     * Check if a lesson is completed
     */
    function isLessonCompleted(lessonId) {
        const progress = GameEngine.getProgress();
        return progress.lessonsCompleted.includes(lessonId);
    }
    
    /**
     * Check if a game is completed
     */
    function isGameCompleted(gameId) {
        const progress = GameEngine.getProgress();
        return progress.gamesCompleted.includes(gameId);
    }
    
    /**
     * Get high score for a game
     */
    function getGameHighScore(gameId) {
        const progress = GameEngine.getProgress();
        return progress.gameScores?.[gameId] || 0;
    }
    
    /**
     * Mark current lesson as complete
     */
    function completeCurrentLesson() {
        const lessonId = document.body.dataset.lessonId;
        if (lessonId) {
            GameEngine.completeLesson(lessonId);
            GameEngine.awardXP(50, `Completed ${lessonId}`);
            
            // Show completion message
            showCompletionMessage();
        }
    }
    
    /**
     * Show lesson completion message
     */
    function showCompletionMessage() {
        const message = document.createElement('div');
        message.className = 'completion-message';
        message.innerHTML = `
            <div style="text-align: center;">
                <div style="font-size: 3rem; margin-bottom: 10px;">🎉</div>
                <h3 style="color: var(--accent-green); margin-bottom: 10px;">Lesson Complete!</h3>
                <p style="color: var(--text-secondary);">Keep up the momentum</p>
            </div>
        `;
        
        document.body.appendChild(message);
        
        // Add styles if not present
        if (!document.getElementById('completion-styles')) {
            const styles = document.createElement('style');
            styles.id = 'completion-styles';
            styles.textContent = `
                .completion-message {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--bg-card);
                    border: 2px solid var(--accent-green);
                    border-radius: 20px;
                    padding: 40px;
                    z-index: 1000;
                    min-width: 300px;
                    box-shadow: 0 0 40px rgba(0, 255, 136, 0.3);
                    animation: popIn 0.3s ease, fadeOut 0.3s ease 2.7s;
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
                    to { opacity: 0; }
                }
            `;
            document.head.appendChild(styles);
        }
        
        setTimeout(() => message.remove(), 3000);
    }
    
    /**
     * Export progress data as JSON
     */
    function exportProgress() {
        const progress = GameEngine.getProgress();
        const dataStr = JSON.stringify(progress, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `bootcamp-progress-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
    }
    
    /**
     * Import progress data from JSON
     */
    function importProgress(jsonData) {
        try {
            const progress = JSON.parse(jsonData);
            GameEngine.saveProgress(progress);
            updateAllDisplays();
            alert('Progress imported successfully!');
        } catch (e) {
            alert('Error importing progress: ' + e.message);
        }
    }
    
    /**
     * Reset all progress (with confirmation)
     */
    function resetProgress() {
        if (confirm('Are you sure you want to reset ALL progress? This cannot be undone.')) {
            localStorage.removeItem('bootcamp-progress');
            location.reload();
        }
    }
    
    /**
     * Get stats for dashboard
     */
    function getStats() {
        const progress = GameEngine.getProgress();
        const level = GameEngine.getCurrentLevel();
        const title = GameEngine.getLevelTitle();
        const xpProgress = GameEngine.getXPToNextLevel();
        
        return {
            totalXP: progress.totalXP,
            level: level,
            levelTitle: title,
            xpToNextLevel: xpProgress,
            currentStreak: progress.currentStreak,
            longestStreak: progress.longestStreak,
            lessonsCompleted: progress.lessonsCompleted.length,
            gamesCompleted: progress.gamesCompleted.length,
            achievementsUnlocked: progress.achievements.length,
            totalAchievements: Object.keys(GameEngine.ACHIEVEMENTS).length,
            daysActive: Object.keys(progress.dailyActivity).length,
            startDate: new Date(progress.startDate).toLocaleDateString()
        };
    }
    
    // Public API
    return {
        init,
        updateAllDisplays,
        getWeekCompletion,
        isLessonCompleted,
        isGameCompleted,
        getGameHighScore,
        completeCurrentLesson,
        exportProgress,
        importProgress,
        resetProgress,
        getStats
    };
})();

// Auto-initialize on DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ProgressTracker.init());
} else {
    ProgressTracker.init();
}

// Make available globally
window.ProgressTracker = ProgressTracker;
