const errHandler = function(res) {
  const headers = {
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, Content-Length, X-Requested-With',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'PATCH, POST, GET,OPTIONS,DELETE',
    'Content-Type': 'application/json'
  }
  res.writeHead(400, headers);
  res.write(JSON.stringify({
    status: 'false',
    message: "資料格式錯誤，或是不正確的 todos id"
  }));
  res.end();
}

module.exports = errHandler;