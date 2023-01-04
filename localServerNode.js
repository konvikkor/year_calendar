const http = require('http');
const fs = require('fs');
const url = require('url');
const path = require('path');

const server = http.createServer((req,res)=>{
    req.on('data',(chunk)=>{
    });
    req.on('end',()=>{
        let localURL = new url.URL(req.url,'http://localhost');
        let filePath = path.resolve('./',`./${localURL.pathname.match(/^\/$/)?'index.html':path.normalize(localURL.pathname)}`);
        console.log(`${path.extname(filePath)} ==> ${localURL.pathname} ${fs.existsSync(filePath)}`);
        if (fs.existsSync(filePath)){
            let fileData = fs.readFileSync(filePath);
            switch (path.extname(filePath)) {
                case '.html': res.setHeader('content-type','text/html'); break;
                case '.css': res.setHeader('content-type','text/css'); break;
                case '.js': res.setHeader('content-type','text/javascript'); break;
                case '.ico': res.setHeader('content-type','image/icon'); break;
                case '.bmp': res.setHeader('content-type','image/bitmap'); break;
                case '.jpeg':
                case '.jpg': res.setHeader('content-type','image/jpeg'); break;
                case '.png': res.setHeader('content-type','image/png'); break;
                default: res.setHeader('content-type','application/octet-stream'); break;
            }
            res.setHeader('content-length',fileData.length);
            res.setHeader('Origin','*');
            res.write(fileData);
            res.end();
        }else{
            res.writeHead(404);
            res.end();
        }
    });
});
server.listen(80);