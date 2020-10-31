import http from 'http';
import colors from 'colors';
import app from './app';

const port = process.env.PORT || 3000;

const server = http.createServer(app);

server.listen(port, () =>
  console.log(`Server up and running on port ${port}`.yellow.bold.underline)
);
