import http from 'http';
import colors from 'colors';
import app from './app';

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () =>
  console.log(`Server up and running on port ${port}`.yellow.bold.underline)
);

// "env": {
//     "MONGO_URI": "mongodb+srv://bilush:noderestshop@node-rest-shop.2fiwx.mongodb.net/ShopApi?retryWrites=true&w=majority",
//     "JWT_KEY": "secret",
//     "JWT_EXPIRE": "1h"
//   }
