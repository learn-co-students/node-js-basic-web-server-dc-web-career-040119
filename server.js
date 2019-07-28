"use strict";

const http         = require('http');
const finalhandler = require('finalhandler');
const Router       = require('router');
const bodyParser   = require('body-parser');
const urlParser    = require('url');
const querystring  = require('querystring');



const router = new Router();
router.use(bodyParser.json());

let messages = []
let nextId = 1;

class Message {
  constructor(message) {
    this.id = nextId;
    this.message = message;
    nextId++;
  }
}

router.get('/', (request, response) => {
  response.setHeader('Content-Type', "text/plain; charset=utf-8")
  response.end('Hello, World!');
});

router.get('/messages', (request, response) => {
  let url = urlParser.parse(request.url),
      params = querystring.parse(url.query);

  let result = JSON.stringify(messages);

  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  response.end(result);
});

router.post('/message', (request, response) => {
  let newMsg;

  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (!request.body.message) {
    response.statusCode = 400;
    response.statusMessage = 'No message provided.';
    response.end();
    return;
  }

  newMsg = new Message(request.body.message);
  messages.push(newMsg);

  response.end(JSON.stringify(newMsg.id));
});

const server = http.createServer((request, response) => {
  router(request, response, finalhandler(request, response));
});

exports.listen = function(port, callback) {
  server.listen(port, callback);
};

exports.close = function(callback) {
  server.close(callback);
};
