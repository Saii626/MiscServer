const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);
const request = require('request');
const fs = require('fs');
const path = require('path');

app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use('/', express.static(path.join(__dirname, '../public/build/default')));
} else {
  app.use('/', express.static(path.join(__dirname, '../public/build/dev')));
}


var scripts = [];
const scriptFolder = path.join(__dirname, './scripts');
fs.readdir(scriptFolder, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  for (let file of files) {
    let stat = fs.statSync(scriptFolder + '/' + file);
    if (stat.isFile() && file.slice(-2) == 'js') {
      scripts.push({
        file: file.substring(0, file.length - 3),
        exec: require('./scripts/' + file)
      });
    }
  }
});

app.get('/:script/:action/', (req, res) => {
  let scr = scripts.find((script) => {
    return script.file === req.params.script;
  });

  if (scr) {
    let promise = Promise.resolve(scr.exec[req.params.action](req.query));
    promise.then((val) => {
      res.send(val);
      return;
    });
  } else {
    res.send('No script found');
  }
});

app.get('/:script', (req, res) => {
  for (let script of scripts) {
    if (script.file === req.params.script) {
      res.send(Object.keys(script.exec));
      return;
    }
  }
  res.send('No script found');
});

function registerSelf() {
  const postData = {
    path: 'misc',
    ip: 'http://localhost:8050',
    name: 'misc'
  }

  request.post('http://localhost:8000/register', {
    form: postData
  }, function(err, res, body) {
    if (res && res.statusCode && (res.statusCode === 200 || res.statusCode === 204)) {
      console.log("Successfully registered");
    } else {
      console.log("Will retry");
      setTimeout(registerSelf, 2000);
    }
  });
}

httpServer.listen(process.env.PORT || 8050, function() {
  if (process.env.NODE_ENV === 'production') registerSelf();
  console.log("Server started on port: " + httpServer.address().port);
});