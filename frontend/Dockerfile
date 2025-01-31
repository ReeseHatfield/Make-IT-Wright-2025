FROM node:18-alpine

WORKDIR /app

COPY app/package*.json ./

RUN npm install

ENV NODE_ENV=development

COPY app ./

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host"]

