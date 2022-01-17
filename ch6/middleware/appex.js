const express = require('express');
const path = require('path');

const app = express();
app.set('port', process.env.PORT || 3000);

// app.use나 app.get같은 미들웨어를 여러개 장착 가능
app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    next();
});
app.get('/',(req, res, next) => {
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res) => { // 요청이 오면 무조건 에러 처리
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.') 
});

// 위에 만약 next(err)가 있는 경우 바로 이 함수가 실행됨 
app.use((err, req, res, next) =>{
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});