#!/bin/bash

# Utilisation :
# ./build.sh        -> Compilation pour la production
# ./build.sh npm    -> Installation de NPM

# Variables
NVM_VERSION=16
DIR_SCRIPT=$(dirname $(readlink -f $0 2>/dev/null || perl -MCwd=realpath -e "print realpath '$0'"))

# Aller dans le dossier du projet
cd $DIR_SCRIPT

# Charger nvm
[ -s "$HOME/.nvm/nvm.sh" ] && \. "$HOME/.nvm/nvm.sh"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -e "/etc/profile.d/nvm.sh" ] && \. "/etc/profile.d/nvm.sh"
if ! command -v "nvm" >/dev/null; then
  echo "nvm n'est pas installé."
  exit 1
fi

# installation des dépendances
nvm install $NVM_VERSION
nvm use $NVM_VERSION
npm i

case $1 in
  'npm')
  ;;
  *)
   npm run build
  ;;
esac