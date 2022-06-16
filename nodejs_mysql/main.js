var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');
var template = require('./lib/template.js');
var path = require('path');
var sanitizeHtml = require('sanitize-html');
var mysql = require('mysql');

var db = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '1111',
  database : 'learn_nodejs_mysql'
});
db.connect();

var app = http.createServer(function(request,response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    var pathname = url.parse(_url, true).pathname;
    if(pathname === '/'){
      if(queryData.id === undefined){
        db.query(`SELECT * FROM topic`, function(err, topics){
          var title = 'Welcome';
          var description = 'Hello, Node.js';
          var list = template.list(topics);
          var html = template.HTML(title, list,
            `<h2>${title}</h2>${description}`,
            `<a href="/create">create</a>`
          );
          response.writeHead(200);
          response.end(html);
        });
      }
      else {
        db.query(`SELECT * FROM topic`, function(err, topics){
          if(err){
            throw err;
          }
          db.query(`SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE id=?`, [queryData.id], function(err2, topic){
            if(err2){
              throw err2;
            }
            var id = topic[0].id
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.HTML(title, list,
              `<h2>${title}</h2>${description}`,
              ` <a href="/create">create</a>
                <a href="/update?id=${id}">update</a>
                <form action="delete_process" method="post">
                  <input type="hidden" name="id" value="${id}">
                  <input type="submit" value="delete">
                </form>`
            );
            response.writeHead(200);
            response.end(html);
          });
        });
      }
    } else if(pathname === '/create'){
      db.query(`SELECT * FROM topic`, function(err, topics){
        var title = 'Create';
        var list = template.list(topics);
        var html = template.HTML(title, list,
          `<form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                <textarea name="description" placeholder="description"></textarea>
              </p>
              <p>
                <input type="submit">
              </p>
            </form>`,
          `<a href="/create">create</a>`
        );

        response.writeHead(200);
        response.end(html);
      });
    } else if(pathname === '/create_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var title = post.title;
          var description = post.description;

          db.query(`INSERT INTO topic (title, description, created, author_id) VALUES(?, ?, NOW(), ?)`, [title, description, 1], function(err, result){
            if(err){
              throw err;
            }
            response.writeHead(302, {Location: `/?id=${result.insertId}`});
            response.end();
          }
        )

      });
    } else if(pathname === '/update'){
        db.query(`SELECT * FROM topic`, function(err, topics){
          if(err){
            throw err;
          }
          db.query(`SELECT * FROM topic WHERE id=?`, [queryData.id], function(err2, topic){
            if(err2){
              throw err2;
            }
            var id = topic[0].id;
            var title = topic[0].title;
            var description = topic[0].description;
            var list = template.list(topics);
            var html = template.HTML(title, list,
              `
              <form action="/update_process" method="post">
                <input type="hidden" name="id" value="${id}">
                <p><input type="text" name="title" placeholder="title" value="${title}"></p>
                <p>
                  <textarea name="description" placeholder="description">${description}</textarea>
                </p>
                <p>
                  <input type="submit">
                </p>
              </form>
              `,
              `<a href="/create">create</a> <a href="/update?id=${title}">update</a>`
            );

            response.writeHead(200);
            response.end(html);

          })
        });
    } else if(pathname === '/update_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;
          var title = post.title;
          var description = post.description;

          db.query(`UPDATE topic SET title=?, description=?, author_id=1 WHERE id=?;`, [title, description, id], function(err, result){
            if(err){
              throw err;
            }
            console.log(result);
            response.writeHead(302, {Location: `/?id=${id}`});
            response.end();
          });
      });
    } else if(pathname === '/delete_process'){
      var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          var id = post.id;

          db.query(`DELETE FROM topic WHERE id=?;`, [id], function(err, result){
            if(err){
              throw err;
            }
            console.log(result);
            response.writeHead(302, {Location: `/`});
            response.end();
          });
      });
    } else {
      response.writeHead(404);
      response.end('Not found');
    }
});
app.listen(3000);
