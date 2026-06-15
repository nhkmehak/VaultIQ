FROM node:22.17.0
WORKDIR /app
COPY package*.json ./
COPY .npmrc ./  
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "src/server.js"] 