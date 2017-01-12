# Sketcher
Une application de création et de partage de dessins en PHP et Javascript.

## Installation
### Site web
Vous avez besoin de Composer. Rendez-vous dans le dossier *SketcherWebsite* et lancez `composer update`.

Créez la base de données avec les commandes
```bash
php bin/console doctrine:database:create
php bin/console doctrine:schema:create
```

Lancez le serveur avec la commande `php bin/console server:run`.

### Serveur de dessin
Rendez-vous dans le dossier *SketcherServer*

Installez les dépendances du projet avec `npm i`.

Lancez le serveur avec la commande `node server.js`.

### Rapport et documentation
Vous trouverez dans le dossier *doc* le rapport aux formats .tex et .pdf
