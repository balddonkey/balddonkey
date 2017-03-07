
String.prototype.sl_endsWith = function(str) {
  if (typeof String.prototype.endsWith != 'function') {
    return this.indexOf(str, this.length - str.length - 1) !== -1;
  }
  return this.endsWith(str);
}

String.prototype.sl_startsWith = function(str) {
  if (typeof String.prototype.startsWith != 'function') {
    return this.slice(0, str.length) === str;
  }
  return this.startsWith(str);
}

function route(path, pathname) {
  console.log("route: " + pathname);
  console.log("type: " + typeof pathname);
  if (pathname === "/") {
    pathname = "/index.html";
  }
  console.log("route: " + pathname);
  let staticPath = "";
  if (pathname.sl_endsWith("html")) {
    staticPath = "./htmls";
  } else if (pathname.sl_endsWith("js")) {
    staticPath = "./scripts";
  } else if (pathname.sl_endsWith("css")) {
    staticPath = "./css";
  } else {
    staticPath = "./srcs";
  }
  return path.join(staticPath, path.normalize(pathname.replace(/\.\./g, "")))
}

exports.route = route;
