const http = require('http');
const cookieParser = require('cookie-parser');


require('dotenv').config();

const app = require('./app');
const { mongoConnect } = require('./services/mongo');


const PORT = process.env.PORT || 5000;


const server = http.createServer(app);


async function startServer() {
  
  await mongoConnect();
  
  server.listen(PORT, () => {
    console.log(`Listening on PORT ${PORT}...`)
  });
}

startServer();