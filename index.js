#!/usr/bin/env node

const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');

const templateDir = path.join(__dirname, 'template');
const publicDir = path.join(templateDir, 'public');
const srcDir = path.join(templateDir, 'src');
const schemasDir = path.join(templateDir, '_schemas');

// Function to copy directories
async function copyDirectory(src, dest) {
  try {
    await fs.copy(src, dest, {
      filter: (src, dest) => !fs.pathExistsSync(dest)
    });
    console.log(`Copied "${path.basename(src)}" directory`);
  } catch (err) {
    console.error(`Error copying "${path.basename(src)}" directory:`, err);
  }
}

// Function to copy src contents
async function copySrc(targetDir) {
  try {
    const srcContents = await fs.readdir(srcDir);
    const srcTargetDir = path.join(targetDir, 'src');

    if (await fs.pathExists(srcTargetDir)) {
      for (const item of srcContents) {
        const srcPath = path.join(srcDir, item);
        const destPath = path.join(srcTargetDir, item);
        await fs.copy(srcPath, destPath, { overwrite: true });
      }
      console.log('Copied contents into existing "src" directory');
    } else {
      for (const item of srcContents) {
        const srcPath = path.join(srcDir, item);
        const destPath = path.join(targetDir, item);
        await fs.copy(srcPath, destPath, { overwrite: true });
      }
      console.log('Copied contents of "src" directory into the root');
    }
  } catch (err) {
    console.error('Error handling "src" directory:', err);
  }
}

// Function to create or update .env and .env.local files
async function setupEnvFiles(targetDir) {
  const envLocalPath = path.join(targetDir, '.env.local');
  const envPath = path.join(targetDir, '.env');

  const envLocalContent = `
# Added by next-secure CLI
# Generated secret key
AUTH_SECRET=<copy_previously_generated_auth_secret>

# Generate GitHub OAuth client from: https://github.com/settings/developers
GITHUB_CLIENT_ID=<github_client_id>
GITHUB_CLIENT_SECRET=<github_client_secret>

# ... you can add more providers

# Email keys according to your provider (resend, sendgrid, gmail smtp, etc.)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@example.com
  `.trim();

  const envContent = `
# Added by next-secure CLI
# if using mongodb replace the url with mongodb connection url.
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=SCHEMA"
  `.trim();

  if (await fs.pathExists(envLocalPath)) {
    await fs.appendFile(envLocalPath, `\n\n${envLocalContent}`);
    console.log('.env.local file updated');
  } else {
    await fs.writeFile(envLocalPath, envLocalContent);
    console.log('.env.local file created');
  }

  if (await fs.pathExists(envPath)) {
    await fs.appendFile(envPath, `\n\n${envContent}`);
    console.log('.env file updated');
  } else {
    await fs.writeFile(envPath, envContent);
    console.log('.env file created');
  }
}

// Function to run shell commands
function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (err) {
    console.error(`Error executing command "${command}":`, err);
    process.exit(1);
  }
}

// Main function
async function main() {
  const targetDir = process.argv[2] || '.';

  if (!fs.existsSync(targetDir)) {
    console.error(`Target directory "${targetDir}" does not exist.`);
    process.exit(1);
  }

  await copyDirectory(publicDir, path.join(targetDir, 'public'));
  await copyDirectory(schemasDir, path.join(targetDir, '_schemas'));
  await copySrc(targetDir);
  await setupEnvFiles(targetDir);

  // Run additional commands
  runCommand('npm install next-auth@beta nodemailer');
  runCommand('npx shadcn@latest init');
  runCommand('npx shadcn@latest add accordion avatar button card dropdown-menu input label separator toast');
  runCommand('npm install @prisma/client @auth/prisma-adapter');
  runCommand('npm install prisma --save-dev');
  runCommand('npx prisma init');

  // Provide next steps to the user
  console.log(`
  Next steps:
  1. Run  command \`openssl rand -base64 32\` to generate the env key.
  2. Add the generated secret key, OAuth provider keys, and email provider to the .env.local file.
  3. Add the OAuth providers in @/auth/provider.js file.
  4. Copy prisma schema according to your database (postgres or mongodb) available in the _schemas directory and paste it into the prisma/schema.prisma file
  5. Run command \`npx prisma migrate dev\` to migrate prisma db

  Authentication is set up in your project! For more details, read the documentation at https://github.com/Decodam/nextsecure#readme
  `);
}

main();
