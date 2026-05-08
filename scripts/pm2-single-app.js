const { execSync } = require('child_process');

const appName = process.env.APP_NAME || 'dreamshop';
const port = process.env.PORT || '3001';
const env = process.env.NODE_ENV || 'production';

function run(command, ignoreError = false) {
  try {
    execSync(command, { stdio: 'inherit', env: process.env });
  } catch (error) {
    if (!ignoreError) throw error;
  }
}

// Always remove legacy names to keep PM2 single-app mode stable.
run('pm2 delete dreamshop-frontend', true);
run('pm2 delete dreamshop-backend', true);
run(`pm2 delete ${appName}`, true);

run(`pm2 start ecosystem.config.js --only ${appName} --update-env`);
run('pm2 save');
run('pm2 status');

console.log(`[pm2-single-app] ${appName} started on PORT=${port} NODE_ENV=${env}`);
