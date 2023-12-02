# Dockerfile.test dans spark_backend/main/user
FROM node:lts

WORKDIR /app

# Copiez d'abord les fichiers de dépendance pour profiter de la mise en cache des couches Docker
COPY package*.json tsconfig.json ./

# Installez les dépendances
RUN npm install

# Copiez maintenant le reste des fichiers du projet
COPY src ./src

EXPOSE 4001

CMD ["npm", "run", "start"]
