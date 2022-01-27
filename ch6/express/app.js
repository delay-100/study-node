const express = require('express');
const path = require('path');

const app = express(); // express 모듈을 실행해 app 변수에 할당
app.set('port', process.envPORT || 3000); // process.env 객체에 PORT 속성이 있으면 그 값 사용, 없다면 기본값으로 3000번 포트 이용
                                          // key: 'port', value : 'process.envPORT || 3000'
app.use((req,res,next)=>{
    console.log('모든 요청에 다 실행됩니다.');
    next();
});
app.get('/', (req, res) => { // GET / 요청 시 응답으로 Hello, Express를 전송
    //  res.send('Hello, Express');  http 모듈에서 사용했던 res.write나 res.end 대신 res.send 사용
    res.sendFile(path.join(__dirname, '/index.html')); // 다른 html 파일을 전송하고 싶은 경우
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중')
});