const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process'); // Voeg deze regel toe

// Stap 1: Angular-build uitvoeren
try {
  console.log('Start Angular production build...');
  execSync('ng build --configuration production', { stdio: 'inherit' });
  console.log('Angular build voltooid!');
} catch (error) {
  console.error('Fout bij Angular build:', error);
  process.exit(1); // Stop het script bij een fout
}

// Stap 2: Kopieer web.config naar de dist-map
try {
  const source = path.join(__dirname, 'web.config');
  const destination = path.join(__dirname, 'dist/fireman-day-off-shedule-cli/browser/web.config');
  fs.copyFileSync(source, destination);
  console.log('web.config is gekopieerd naar de dist-map.');
} catch (error) {
  console.error('Fout bij kopiëren web.config:', error);
  process.exit(1);
}

// Stap 3: FTP-upload
const config = {
    user: "gidcobe@gidco.be",
    password: "LilyLove25092017",
    host: "windowsftp.webhosting.be",
    port: 21,
    localRoot: __dirname + "/dist/fireman-day-off-shedule-cli/browser",
    remoteRoot: "/subsites/verlof.gidco.be/",
    include: ['*', '**/*', 'web.config'],
    deleteRemote: true,
    forcePasv: true
};

ftpDeploy.deploy(config)
    .then(res => console.log('Upload voltooid:', res))
    .catch(err => {
        console.error('Fout bij uploaden:', err);
        process.exit(1);
    });