const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const dotenv = require('dotenv'); 
const path = require('path');

dotenv.config();

// 라우터 분리
const indexRouter = require('./routes'); 
const userRouter = require('./routes/user');

const app = express();
app.set('port', process.env.PORT || 3000);

// pug
// app.set('views', path.join(__dirname, 'views')); // views는 템플릿 파일들이 위치한 폴더를 지정
// app.set('view engine', 'pug'); // pug 템플릿을 이용한다고 나타냄

// 넌적스
app.set('view engine', 'html'); // 넌적스임을 구분하려면 html 대신 njk를 쓰면 됨
const nunjucks = require('nunjucks');
nunjucks.configure('views', { // 폴더 경로: views
    express: app, // 위에 const app = express();라서 app객체 즉, express 함수를 넣음
    watch: true, // html 파일이 변경될 때, 템플릿 엔진을 다시 렌더링
});


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
// 인수: session에 대한 설정
app.use(session({
    resave:false, // resave : 요청이 올 때 세션에 수정 사항이 생기지 않더라도 세션을 다시 저장할지 설정
    saveUninitialized: false, // saveUninitialized : 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정
    secret: process.env.COOKIE_SECRET,
    cookie: { // 세션 쿠키에 대한 설정
        httpOnly: true, // httpOnly: 클라이언트에서 쿠키를 확인하지 못하게 함
        secure: false, // secure: false는 https가 아닌 환경에서도 사용 가능 - 배포할 때는 true로 
                        // 코드에는 없지만, store: 데이터베이스에 연결해서 세션을 유지 
    },
    name: 'session-cookie',
}));

// 라우터 경로 설정
app.use('/', indexRouter); // localhost:3000
app.use('/user', userRouter); // localhost:3000/user

// multer
const multer = require('multer');
const fs = require('fs');

try {
    fs.readdirSync('uploads'); // sync로 upload 폴더 읽음
}catch(error){
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다');
    fs.mkdirSync('uploads'); // upload 폴더가 없으면 upload가 불가능하므로 폴더 생성
}
const upload = multer({ // multer의 인수로 설정을 넣음
    storage: multer.diskStorage({ // storage(저장 위치) 속성
        destination(req, file, done){ // 어디?(요청 정보, 업로드한 파일 정보, 함수) -> req, file 데이터를 가공 후 done으로 넘김
            done(null, 'uploads/'); // done(에러가 있으면 에러를 넣음, 실제 경로(or 파일 이름))
        },
        filename(req, file, done){ // 파일 이름
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 이름이 겹치지 않도록 이름에 현재 시간을 저장 
            // 결국, upload라는 폴더에 [파일명+현재시간.확장자]로 업로드
        },
    }),
    limits: {fileSize: 5 * 1024 * 1024}, // 업로드 제한 사항:{파일 크기: 5mb}
});
app.get('/upload', (req, res)=> {
    res.sendFile(path.join(__dirname, 'multipart2.html'));
});
app.post('/upload', upload.fields([{name: 'image1'},{name: 'image2'}]),
    (req, res) => {
        console.log(req.files, req.body);
        res.send('ok');
    },
);

// 파일을 하나만 업로드하는 방법 (multipart.html)
// app.post('/upload', upload.single('image'), (req, res) => {
//     console.log(req.file, req.body);
//     res.send('ok');
//   });

// 여러 파일을 업로드하는 방법 (multipart2.html)
// app.post('/upload', upload.array('many', (req,res) => {
//     console.log(req.files, req.body);
//     res.send('ok');
// }))

// 여러 파일을 업로드하는 방법2 (multipart2.html)
// app.post('/upload', upload.fields([{name: 'image1'}, {name: 'image2'}]),(req, res) => {
//     console.log(req.files, req.body);
//     res.send('ok');
// },
// );

// 파일을 업로드하지 않고 멀티파트 형식으로 업로드 방법 (multipart3.html)
// app.post('/upload', upload.none(), (req, res)=> {
//     console.log(req.body); // 파일을 업로드하지 않았으므로 req.body만 존재
//     res.send('ok');
// });

// req.session.name = 'delay100'; // 세션 등록
// req.sessionID; //세션 아이디 확인
// req.session.destroy(); // 세션 모두 제거

// 에러처리
// app.use((req, res, next) => {
//     res.status(404).send('Not Found'); // 일치하는 라우터가 없을 때 404 상태 코드를 응답
// });

app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    req.data = '데이터 넣기';
    next();
}, (req, res, next)=>{
    console.log(req.data);
    next();
});

app.get('/',(req, res, next) => {
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res) => {
    //    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')  // 요청이 오면 무조건 에러 처리
});

// 에러 처리
app.use((req, res, next) => {
const error = new Error(`${req.method} ${req.url} 라우터가 없습니다.`);
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) =>{
    console.error(err);
    // res.status(500).send(err.message);
    res.locals.message = err.message; // res.locals 속성에 값을 대입해 템플릿 엔진에 변수를 주입, message라는 변수를 넣음
    res.locals.error = process.env.NODE_ENV !== 'production' ? err : {}; // 배포 환경이 아닐 시에만 표시, process.env.NODE_ENV : 시스템 환경
    res.status(err.status || 500); // 굳이 안줘도 되지만 서버에서 그냥 에러상태 주는 것,,
    // res.render('error.pug');
    res.render('error'); // error.html 파일이 렌더링 됨
});

app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기 중');
});