const express = require('express');
const path = require('path');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const nunjucks = require('nunjucks');
const dotenv = require('dotenv');

dotenv.config(); // .env 파일을 쓸 수 있게 함
const webSocket = require('./socket'); // 웹 소켓
// 라우터 연결
const indexRouter = require('./routes');
const connect = require('./schemas');

const app = express();
app.set('port', process.env.PORT || 8005); // 포트번호 설정
app.set('view engine', 'html');

nunjucks.configure('views', {
    express: app,
    watch: true,
});
connect();

// Socket.IO와 express-session 연결을 위해 변수로 설정(app.js와 socket.js간에 express-session 미들웨어를 공유하기 위함)
const sessionMiddleware = session({
    resave: false, // resave : 요청이 올 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 설정
    saveUninitialized: false, // saveUninitialized : 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
});

app.use(morgan('dev')); // morgan 연결 후 localhost:3000에 다시 접속하면 기존 로그 외 추가적인 로그를 볼 수 있음

// static 폴더 설정
app.use(express.static(path.join(__dirname, 'public')));

// body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));// extended 옵션이 false면 노드의 querystring 모듈을 사용하여 쿼리스트링을 해석
// extended 옵션이 true면 qs 모듈을 사용하여 쿼리스트링을 해석 - qs 모듈은 내장 모듈이 아닌 npm의 패키지(querystring 모듈의 기능을 좀 더 확장한 모듈임)

app.use(cookieParser(process.env.COOKIE_SECRET)); // .env 파일의 COOKIE_SECRET 변수 사용 - 보안 UP

app.use(sessionMiddleware); // express-session 설정 넣어줌

// 세션 아이디를 HEX 형식의 색상 문자열(#000000 같은)로 바꿈
app.use((req, res, next) => {
    if (!req.session.color) {
        const colorHash = new ColorHash();
        req.session.color = colorHash.hex(req.sessionID); // 앞으로 req.session.color을 사용자 아이디처럼 사용 가능
    }
    next();
});

// 라우터 연결
app.use('/', indexRouter);

// 라우터가 없을 때 실행 
app.use((req, res, next) => {
    const error = new Error(`${req.method} ${req.url} 라우터가 없습니다`);
    error.status = 404;
    next(error);
});

// 에러 관련 함수 
app.use((err, req, res, next) => {
    res.locals.message = err.message;
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// 웹 소켓을 express에 연결
const server = app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});

webSocket(server, app, sessionMiddleware);