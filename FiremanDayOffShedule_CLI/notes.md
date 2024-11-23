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