const http = require('http');
const { v4: uuidv4 } = require('uuid');
const errHandler = require('./errHandler.js');
const todos = [];

const reqlistner = function(req, res) {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  let body = '';
  req.on('data', chunk => {
    body += chunk;
  });
  if(req.url === '/todos' && req.method === 'GET') {
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      data: todos
    }));
    res.end();
  } else if(req.url === '/todos' && req.method === 'POST') {
    req.on('end', () => {
      try{
        const title = JSON.parse(body).title;
        if(title !== undefined) {
          const data = {
            id: uuidv4(),
            title: title,
          }
          todos.push(data);
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            status: 'success',
            data: todos
          }));
          res.end();
        }else{
          errHandler(res);
        }
      } catch(err){
        errHandler(res);
      }
    });
  } else if(req.url === '/todos' && req.method === 'DELETE') {
    todos.length = 0;
    res.writeHead(200, headers);
    res.write(JSON.stringify({
      status: 'success',
      data: todos
    }));
    res.end();
  } else if(req.url.startsWith('/todos/') && req.method === 'DELETE') {
    const id = req.url.split('/').pop();
    const index = todos.findIndex(todo => todo.id === id);
    if(index !== -1) {
      todos.splice(index, 1);
      res.writeHead(200, headers);
      res.write(JSON.stringify({
        status: 'success',
        data: todos
      }));
      res.end();
    } else {
      errHandler(res);
    }
  } else if(req.url.startsWith('/todos/') && req.method === 'PATCH') {
    req.on('end', () => {
      try {
        const id = req.url.split('/').pop();
        const title = JSON.parse(body).title;
        const index = todos.findIndex(todo => todo.id === id);
        if (index !== -1 && title !== undefined) {
          todos[index].title = title;
          res.writeHead(200, headers);
          res.write(JSON.stringify({
            status: 'success',
            data: todos
          }));
          res.end();
        }else{
          errHandler(res);
        }
      } catch {
        errHandler(res);
      }
    });
  } else if(req.url === '/' && req.method === 'OPTIONS') {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(JSON.stringify({
      status: "false",
      message: "無此網站路由"
    }));
    res.end();
  }
}

const server = http.createServer(reqlistner);

server.listen(3005);