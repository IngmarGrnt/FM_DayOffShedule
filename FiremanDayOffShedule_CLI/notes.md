# Notities Angular

## Start Angular CLI
- ng serve

## Home component creeren in de src map
- ng generate component Home --standalone --inline-template

## ## Houselocation component creeren in de src map
- ng generate component HouseLocation --standalone --inline-template

## maken van een interface tussen ons en de data
- ng generate interface persondetails

## maken van de detailspage
ng g c details --standalone --inline-template

## Service toevoegen met dependencie injection
ng g s housing

## json maken
mkdir db.json

## json server starten
json-server --watch db.json

##  Maken van een nieuw component
- ng g c yearCalender --inline-template=false --inline-style=false
CREATE src/test/test.component.html (20 bytes)
CREATE src/test/test.component.spec.ts (601 bytes)
CREATE src/test/test.component.ts (238 bytes)
CREATE src/test/test.component.css (0 bytes)



## deploy.js voor deployen naar FTP server
- node deploy.js
const FtpDeploy = require('ftp-deploy');
const ftpDeploy = new FtpDeploy();
const fs = require('fs');
const path = require('path');



```Javascript
// Kopieer web.config naar de dist-map
const source = path.join(__dirname, 'web.config');
const destination = path.join(__dirname, 'dist/fireman-day-off-shedule-cli/browser/web.config');
fs.copyFileSync(source, destination);
console.log('web.config is gekopieerd naar de dist-map.');

// FTP-upload configuratie
const config = {
    user: "gidcobe@gidco.be",
    password: "LilyLove25092017",
    host: "windowsftp.webhosting.be",
    port: 21,
    localRoot: __dirname + "/dist/fireman-day-off-shedule-cli/browser",
    remoteRoot: "/subsites/verlof.gidco.be/", // Pas dit aan naar de juiste submap
    include: ['*', '**/*', 'web.config'], // Voeg 'web.config' expliciet toe
    deleteRemote: true, // Verwijder bestaande bestanden op de server
    forcePasv: true // Voor sommige FTP-servers nodig
};

// Upload de bestanden
ftpDeploy.deploy(config)
    .then(res => console.log('Upload voltooid:', res))
    .catch(err => console.log('Fout bij uploaden:', err));

```