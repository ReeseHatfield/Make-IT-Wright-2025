FROM node:18-alpine

WORKDIR /

COPY package*.json ./

RUN npm install
RUN npm install maplibre-gl
RUN npm install 
COPY . ./

EXPOSE 5173

CMD ["npm", "run", "dev"]
