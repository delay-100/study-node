const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv'); 
const path = require('path');

dotenv.config();
const app = express();
app.set('port', process.env.PORT || 3000);

// req, res, next들은 미들웨어 내부에 들어있음
// morgan
app.use(morgan('dev')); 
// static
app.use('/', express.static(path.join(__dirname, 'public'))); 
// body-parser
app.use(express.json());
app.use(express.urlencoded({extended: false})); // extended 옵션이 false면 노드의 querystring 모듈을 사용하여 쿼리스트링을 해석
                                                // extended 옵션이 true면 qs 모듈을 사용하여 쿼리스트링을 해석 - qs 모듈은 내장 모듈이 아닌 npm의 패키지(querystring 모듈의 기능을 좀 더 확장한 모듈임)
// cookie-parser
app.use(cookieParser(process.env.COOKIE_SECRET)); // 비밀키 할당, process.env.COOKIE_SECRET에 cookiesecret 값(키=값 형식)이 할당됨
// // cookie 생성(res.cookie)
//               키, 값, 옵션
// res.cookie('name', 'delay100', {
//     expires: new Date(Date.now() + 900000),
//     httpOnly: true,
//     secure: true,
// });
// // cookie 제거(res.clearCookie)
// res.clearCookie('name', 'delay100', {httpOnly: true, secure: true});

// express-session
app.use(session({
    resave:false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie',
}));

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

app.use((err, req, res, next) =>{
    console.error(err);
    res.status(500).send(err.message);
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});