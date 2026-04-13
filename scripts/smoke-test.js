const assert = require('node:assert/strict');
const app = require('../server');

const checks = [
    { path: '/', type: 'html', includes: 'Learn AI Through Games' },
    { path: '/games', type: 'html', includes: 'Learn AI Through Games' },
    { path: '/games/prompt-escape-rooms', type: 'html', includes: 'Prompt Escape Room' },
    { path: '/api/games', type: 'json' },
    { path: '/games/hub/assets/lock-8bit.png', type: 'asset' },
    { path: '/games/prompt-escape-rooms/assets/rooms/favicon.ico', type: 'asset' }
];

async function run() {
    const server = app.listen(0, '127.0.0.1');

    try {
        await new Promise((resolve, reject) => {
            server.once('listening', resolve);
            server.once('error', reject);
        });

        const address = server.address();
        const baseUrl = `http://127.0.0.1:${address.port}`;

        for (const check of checks) {
            const response = await fetch(`${baseUrl}${check.path}`);
            assert.equal(response.status, 200, `Expected 200 for ${check.path}, got ${response.status}`);

            if (check.type === 'html') {
                const body = await response.text();
                assert.match(body, /<!DOCTYPE html>/i, `Expected HTML doctype for ${check.path}`);
                if (check.includes) {
                    assert.ok(body.includes(check.includes), `Expected "${check.includes}" in ${check.path}`);
                }
            }

            if (check.type === 'json') {
                const body = await response.json();
                assert.ok(Array.isArray(body), 'Expected /api/games to return an array');
                assert.ok(body.length >= 1, 'Expected /api/games to include at least one game');
            }
        }

        console.log('Smoke checks passed.');
    } finally {
        await new Promise((resolve) => server.close(resolve));
    }
}

run().catch((error) => {
    console.error('Smoke checks failed.');
    console.error(error.message);
    process.exit(1);
});
