import http from 'http';
import colors from 'colors';
import app from './app';

const port = process.env.PORT;

const server = http.createServer(app);

server.listen(port, () =>
  console.log(`Server up and running on port ${port}`.yellow.bold.underline)
);

export default server;
