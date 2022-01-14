const http = require('http');

http.createServer((req,res)=> {
    res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
    res.write('<h1>Hello Node!</h1>');
    res.end('<p>Hello Server!</p>');
})
// 이벤트 리스너 생성, 서버를 계속 열어둠!
 .listen(8080, () => { // 서버연결
    console.log('8080번 포트에서 서버 대기 중입니다!');
});