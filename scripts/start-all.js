const { spawn, execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const isProduction = process.env.NODE_ENV === 'production';
const frontendPort = process.env.PORT || '3001';
const backendPort = process.env.BACKEND_PORT || '5000';
process.env.PORT = frontendPort;
process.env.BACKEND_PORT = backendPort;

const hasDatabaseUrl = Boolean(
  process.env.NEON_DATABASE_URL || process.env.DATABASE_URL || process.env.POSTGRES_URL
);
const runBackendInProduction = process.env.RUN_BACKEND_IN_PRODUCTION === 'true';
const shouldRunBackend = !isProduction || runBackendInProduction;

if (isProduction && shouldRunBackend) {
  const backendDist = path.join(process.cwd(), 'src', 'backend', 'dist', 'backend', 'server.js');
  if (!fs.existsSync(backendDist)) {
    console.log('[start:all] backend dist missing. Running backend build...');
    execSync('npm run backend:build', { stdio: 'inherit', env: process.env });
  }
}

const commands = [];

if (isProduction) {
  if (shouldRunBackend) {
    if (!hasDatabaseUrl) {
      console.warn('[start:all] Skipping backend in production because DATABASE_URL/NEON_DATABASE_URL is missing.');
    } else {
      commands.push({ name: 'backend', cmd: 'npm', args: ['run', 'backend:start'] });
    }
  }
  commands.push({ name: 'frontend', cmd: 'npm', args: ['run', 'start', '--', '-p', frontendPort] });
} else {
  commands.push({ name: 'backend', cmd: 'npm', args: ['run', 'backend:dev'] });
  commands.push({ name: 'frontend', cmd: 'npm', args: ['run', 'dev', '--', '-p', frontendPort] });
}

const children = [];
let shuttingDown = false;

function startProcess({ name, cmd, args }) {
  const child = spawn(cmd, args, {
    stdio: 'inherit',
    shell: true,
    env: process.env,
  });

  child.on('exit', (code) => {
    if (shuttingDown) return;
    shuttingDown = true;
    for (const proc of children) {
      if (proc.pid && proc.pid !== child.pid) {
        proc.kill('SIGTERM');
      }
    }
    process.exit(code ?? 1);
  });

  return child;
}

for (const command of commands) {
  console.log(`[start:all] Starting ${command.name} via: ${command.cmd} ${command.args.join(' ')}`);
  const child = startProcess(command);
  children.push(child);
}

function shutdown(signal) {
  if (shuttingDown) return;
  shuttingDown = true;
  console.log(`[start:all] Received ${signal}, stopping child processes...`);
  for (const child of children) {
    if (child.pid) {
      child.kill('SIGTERM');
    }
  }
  setTimeout(() => process.exit(0), 500);
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
