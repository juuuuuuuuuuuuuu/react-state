var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control) {
  return `
  <!doctype html>
  <html>
  <head>
    <title>WEB1 - ${title}</title>
    <meta charset="utf-8">
  </head>
  <body>
    <h1><a href="/">WEB</a></h1>
    ${list}
    ${control}
    ${body}
  </body>
  </html>
  `;
}

function templateList(filelist) {
  var list = '<ul>';
  var i = 0;
  while (i < filelist.length) {
    list = list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
    i = i + 1;
  }
  list = list + '</ul>';
  return list;
}

var app = http.createServer(function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  var pathname = url.parse(_url, true).pathname;

  if (_url == '/') {
    _url = '/index.html';
  }
  if (request.url == '/favicon.ico') {
    return response.writeHead(404);
  }

  // var args = process.argv;
  // console.log(args)
  var list = '<ul>';
  fs.readdir('./data', function (error, filelist) {
    filelist.forEach((file) => {
      list += `<li><a href="/?id=${file}">${file}</a></li>`;
    });
    list += '</ul>';
  });

  if (pathname === '/') {
    if (queryData.id === undefined) {
      fs.readdir('./data', function (error, filelist) {
        var title = 'Welcome';
        var description = 'Hello, Node.js';
        var list = templateList(filelist);
        var template = templateHTML(
          title,
          list,
          `<h2>${title}</h2>${description}`,
          `<a href="/create">create</a>`
        );
        response.writeHead(200);
        response.end(template);
      });
    } else {
      fs.readdir('./data', function (error, filelist) {
        fs.readFile(
          `data/${queryData.id}`,
          'utf8',
          function (err, description) {
            var title = queryData.id;
            var list = templateList(filelist);
            var template = templateHTML(
              title,
              list,
              `<h2>${title}</h2>${description}`,
              `<a href="/create">create</a> <a href="/update?id=${title}">update</a>
              <form action="delete_process" method="post">
              <input type="hidden" name="id" value="${title}">
              <input type="submit" value="delete">
            </form>
              `
            );
            response.writeHead(200);
            response.end(template);
          }
        );
      });
    }
  } else if (pathname === '/create') {
    var body = '';

    // post방식으로 데이터 전달할때 데이터 용량이 커지면 꺼지거나 할 수 있음
    // post방식으로 전달하는 데이터 받음 (용량이 크면 중간에 끊는 로직도 있움)
    request.on('data', function (data) {
      body += data;
    });

    // 데이터 다 받았으면 end 콜백 호출
    request.on('end', function () {
      const post = qs.parse(body);
      const title = post.title;
      const description = post.description;
      console.log('post***', post);
      // 파일생성
      fs.writeFile(`data/${title}`, description, 'utf-8', function (err) {
        // 다른 페이지로 redirect 시키기 (생성된 페이지로 redirect)
        response.writeHead(302, {
          Location: `/?id=${title}`,
        });
        response.end();
      });
    });
  } else if (pathname === '/update') {
    fs.readdir('./data', function (error, filelist) {
      fs.readFile(`data/${queryData.id}`, 'utf8', function (err, description) {
        var title = queryData.id;
        var list = templateList(filelist);
        var template = templateHTML(
          title,
          list,
          `
            <form action="/update_process" method="post">
              <input type="hidden" name="id" value="${title}">
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
        response.end(template);
      });
    });
  } else if (pathname === '/update_process') {
    var body = '';

    // 데이터 읽어오고
    request.on('data', function (data) {
      body += data;
    });

    // 데이터 다 읽어왓으면
    request.on('end', function () {
      var post = qs.parse(body);
      console.log('**', post.id);
      var id = post.id;
      var title = post.title;
      var description = post.description;
      // 파일명 수정
      fs.rename(`data/${id}`, `data/${title}`, (err) => {
        // 내용 수정
        fs.writeFile(`data/${title}`, description, 'utf8', function (err) {
          response.writeHead(302, {
            Location: `/?id=${title}`,
          });
          response.end();
        });
      });
    });
  } else if (pathname === '/delete_process') {
    var body = '';

    request.on('data', function (data) {
      body += data;
    });

    request.on('end', function () {
      var post = qs.parse(body);
      var title = post.title;

      fs.unlink(`data/${title}`, function(err) {
        response.writeHead(302, {
          Location: `/`
        });
        response.end();
      })
    })
  } else {
    response.writeHead(404);
    response.end('Not Found');
  }
});
app.listen(9000);
