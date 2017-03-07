let http = require("http"),
  url = require("url"),
  fs = require("fs"),
  path = require("path"),
  MIME = require("./MIME.js").type,
  zlib = require("zlib"),
  router = require("./router.js"),
  typer = require("./MIME.js");

let staticPath = "./res/";

let Expires = {
  fileMatch: /^(gif|png|jpg|js|css)$/ig,
  maxAge: 60 * 60 // 一小时
};

let app = http.createServer((request, response) => {
  let pathName = url.parse(request.url).pathname || "/index.html",
    realPath = router.route(path, pathName); //path.join(staticPath, path.normalize(pathName.replace(/\.\./g, "")));; // 请求文件的在磁盘中的真实地址

  console.log("realPath: " + realPath);
  fs.exists(realPath, (exists) => {
    if (!exists) {
      // 当文件不存在时
      response.writeHead(404, { "Content-Type": "text/plain" });

      response.write("This request URL ' " + realPath + " ' was not found on this server.");
      response.end();
    } else {
      // 当文件存在时
      fs.readFile(realPath, "binary", (err, file) => {
        if (err) {
          // 文件读取出错
          response.writeHead(500, { "Content-Type": "text/plain" });

          response.end(err);
        } else {
          // 当文件可被读取时，输出文本流
          let extName = path.extname(realPath);
          extName = extName ? extName.slice(1) : "";
          let contentType = typer.fetchContentType(extName)

          if (extName.match(Expires.fileMatch)) {
            let expires = new Date();
            expires.setTime(expires.getTime() + Expires.maxAge * 1000);
            response.setHeader("Expires", expires.toUTCString());
            response.setHeader("Cache-Control", "max-age=" + Expires.maxAge);
          }

          let stat = fs.statSync(realPath);
          let lastModified = stat.mtime.toUTCString();
          response.setHeader("Last-Modified", lastModified);

          if (request.headers["if-modified-since"] && lastModified == request.headers["if-modified-since"]) {
            response.writeHead(304, "Not Modified");
            response.end();
            return;
          }
          let raw = fs.createReadStream(realPath);
          let acceptEncoding = request.headers['accept-encoding'] || '';
          if (acceptEncoding.match(/\bdeflate\b/)) {
            response.writeHead(200, { 'Content-Encoding': 'deflate' });
            raw.pipe(zlib.createDeflate()).pipe(response);
          } else if (acceptEncoding.match(/\bgzip\b/)) {
            response.writeHead(200, { 'Content-Encoding': 'gzip' });
            raw.pipe(zlib.createGzip()).pipe(response);
          } else {
            response.writeHead(200, {});
            raw.pipe(response);
          }
        }
      });
    }
  });
});

// var port = 8888;
var port = 80;
// var domain = "107.170.244.39";
app.listen(port);
