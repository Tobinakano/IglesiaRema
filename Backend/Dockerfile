# Dockerfile para el backend (Node.js + SQLite)
FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
EXPOSE 4000
CMD ["node", "server.js"]
