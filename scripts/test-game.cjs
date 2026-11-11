// Compile the pure game module to a temporary directory, then run Node's tests.
const { mkdtempSync, rmSync } = require('node:fs');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');
const { execFileSync } = require('node:child_process');
const build = mkdtempSync(join(tmpdir(), 'met-palette-tests-'));
try {
  execFileSync(process.execPath, [require.resolve('typescript/bin/tsc'), 'lib/color-game.ts', '--outDir', build, '--target', 'es2020', '--module', 'commonjs', '--skipLibCheck'], { cwd: resolve(__dirname, '..'), stdio: 'inherit' });
  execFileSync(process.execPath, ['--test', resolve(__dirname, '../tests/color-game.test.cjs')], { env: { ...process.env, COLOR_GAME_BUILD: build }, stdio: 'inherit' });
} finally {
  rmSync(build, { recursive: true, force: true });
}
