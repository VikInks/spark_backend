FROM node:lts

WORKDIR /app

# Copiez d'abord les fichiers de dépendance pour profiter de la mise en cache des couches Docker
COPY package*.json tsconfig.json ./

# Installez les dépendances, y compris nodemon comme dépendance de développement
RUN npm install

# Copiez maintenant le reste des fichiers du projet
COPY . .

EXPOSE 4000

# Utilisez nodemon pour démarrer l'application
CMD ["npx", "nodemon", "main/server.ts"]
