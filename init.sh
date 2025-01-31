# prereqs:
# npx and npm
# X-11 


mkdir frontend
mkdir backend

cd frontend
touch Dockerfile 

echo -e "FROM node:18-alpine\n\
\n\
WORKDIR /app\n\
\n\
COPY app/package*.json ./\n\
\n\
RUN npm install\n\
\n\
ENV NODE_ENV=development\n\
\n\
COPY app ./\n\
\n\
EXPOSE 5173\n\
\n\
CMD [\"npm\", \"run\", \"dev\", \"--\", \"--host\"]\n" > Dockerfile


# need vite
# need sudo pacman -S libotf


# Switch to an X environment to use ViTE (you can usually do it when selecting your desktop environment when you login on your machine).
# ;-;
npm create vite@latest app --template vanilla
cd app
npm install
rm -rf .git
rm .gitignore
rm -rf src/__tests__

echo -e "import { useState, useEffect } from \"react\";\n\
\n\
function App() {\n\
  const [data, setData] = useState(null);\n\
\n\
  useEffect(() => {\n\
    fetch(\"http://localhost:3000\")\n\
      .then((response) => response.json())\n\
      .then((data) => setData(data))\n\
      .catch((error) => console.error(\"Error fetching data:\", error));\n\
  }, []);\n\
\n\
  return (\n\
    <div style={{ padding: \"20px\", fontFamily: \"Arial, sans-serif\" }}>\n\
      <h1>Data from Server</h1>\n\
      {data ? (\n\
        <pre>{JSON.stringify(data, null, 2)}</pre>\n\
      ) : (\n\
        <p>Loading...</p>\n\
      )}\n\
    </div>\n\
  );\n\
}\n\
\n\
export default App;\n" > src/App.jsx


# test running frontend
# sudo docker build -t my-vite-dev
# sudo docker run -p 5173:5173 -t 'my-vite-dev'

cd ../..

cd backend
npm init -y
npm install express
npm install cors
npm install vite --save-dev
touch Dockerfile
echo -e "FROM node:18-alpine\n\
\n\
WORKDIR /app\n\
\n\
COPY package.json ./\n\
\n\
RUN npm install\n\
\n\
COPY src ./src\n\
\n\
EXPOSE 3000\n\
\n\
CMD [\"node\", \"src/index.js\"]\n" > Dockerfile

mkdir src
touch src/index.js

echo -e "const express = require('express')\n\
const cors = require('cors')\n\
\n\
const app = express()\n\
const port = 3000\n\
\n\
// enable CORS for all routes, change this as needed\n\
app.use(cors())\n\
\n\
app.get('/', (req, res) => res.json({ message: \"Hello World with CORS!\" }))\n\
\n\
app.listen(port, () => console.log(\`Example app with CORS enabled listening at http://localhost:\${port}\`))\n" > src/index.js


cd ..
touch docker-compose.yml

echo -e "version: '3.8'\n\
services:\n\
  frontend:\n\
    build:\n\
      context: ./frontend\n\
      dockerfile: Dockerfile\n\
    ports:\n\
      - \"5173:5173\"\n\
    volumes:\n\
      - ./frontend/app:/app\n\
      - /app/node_modules\n\
    command: [\"npm\", \"run\", \"dev\", \"--\", \"--host\"]\n\
    environment:\n\
      - NODE_ENV=development\n\
\n\
  backend:\n\
    build:\n\
      context: ./backend\n\
      dockerfile: Dockerfile\n\
    ports:\n\
      - \"3000:3000\"\n\
    volumes:\n\
      - ./backend/src:/app/src\n\
      - /app/node_modules\n\
    command: [\"node\", \"src/index.js\"]\n\
    environment:\n\
      - NODE_ENV=development\n" > docker-compose.yml

touch run-docker.sh
echo -e "echo \"Building and running docker compose\"\n" >> run-docker.sh
echo -e "sudo docker compose build --no-cache\n" >> run-docker.sh
echo -e "sudo docker compose up\n" >> run-docker.sh

chmod u+x *.sh
