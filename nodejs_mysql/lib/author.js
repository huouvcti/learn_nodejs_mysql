var url = require('url');
var qs = require('querystring');
var db = require('./db.js');

var db = require('./db');
var template = require('./template.js');


exports.home = function(request, response){
  db.query(`SELECT * FROM topic`, function(error,topics){
      db.query(`SELECT * FROM author`, function(error2,authors){
          var title = 'author';
          var list = template.list(topics);
          var html = template.HTML(title, list,
          `
          ${template.authorTable(authors)}
          <style>
              table{
                  border-collapse: collapse;
              }
              td{
                  border:1px solid black;
              }
          </style>
          <form action="/author/create_process" method="post">
              <p>
                  <input type="text" name="name" placeholder="name">
              </p>
              <p>
                  <textarea name="profile" placeholder="description"></textarea>
              </p>
              <p>
                  <input type="submit">
              </p>
          </form>
          `,
          ``
          );
          response.writeHead(200);
          response.end(html);
      });
  });
}

exports.create_process = function(request, response){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      var name = post.name;
      var profile = post.profile;

      db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`, [name, profile], function(err, result){
        if(err){
          throw err;
        }
        response.writeHead(302, {Location: `/author`});
        response.end();
      })
  });
}

exports.update = function(request, response){
  var _url = request.url;
  var queryData = url.parse(_url, true).query;

  db.query(`SELECT * FROM topic`, function(err, topics){
    db.query(`SELECT * FROM author`, function(err, authors){
      db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(err2, author){
        var title = 'author';
        var name = author[0].name;
        var profile = author[0].profile;
        var list = template.list(topics);
        var html = template.HTML(title, list,
        `
        ${template.authorTable(authors)}
        <style>
            table{
                border-collapse: collapse;
            }
            td{
                border:1px solid black;
            }
        </style>
        <form action="/author/update_process" method="post">
            <input type="hidden" name="id" value="${queryData.id}">
            <p>
              <input type="text" name="name" placeholder="name" value=${name}>
            </p>
            <p>
                <textarea name="profile" placeholder="description">${profile}</textarea>
            </p>
            <p>
                <input type="submit">
            </p>
        </form>
        `,
        ``
        );

        response.writeHead(200);
        response.end(html);
      })
    })
  })
}

exports.update_process = function(request, response){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;
      var name = post.name;
      var profile = post.profile;

      db.query(`UPDATE author SET name=?, profile=? WHERE id=?;`, [name, profile, id], function(err, result){
        if(err){
          throw err;
        }
        console.log(result);
        response.writeHead(302, {Location: `/author`});
        response.end();
      });
  });
}

exports.delete_process = function(request, response){
  var body = '';
  request.on('data', function(data){
      body = body + data;
  });
  request.on('end', function(){
      var post = qs.parse(body);
      var id = post.id;

      db.query(`DELETE FROM author WHERE id=?;`, [id], function(err, result){
        if(err){
          throw err;
        }
        console.log(result);
        response.writeHead(302, {Location: `/author`});
        response.end();
      });
  });

}
