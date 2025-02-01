FROM node:18-alpine

WORKDIR /app

COPY app/package*.json ./

RUN npm install
RUN npm install maplibre-gl

COPY . ./

EXPOSE 5173

CMD ["npm", "run", "dev"]
