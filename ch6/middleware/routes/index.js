const express = require('express');

const router = express.Router();

// GET / 라우터
router.get('/', (req, res) => {
    // res.send('Hello, Express');
    // 변수 넣기 방법1
    // res.locals.title = 'Express'; //  pug, 넌적스 같은 템플릿 엔진이 res.locals 객체를 읽어 title이라는 변수를 집어넣음
    // res.render('index');
    // 변수 넣기 방법2
    res.render('index', {title: 'Express'}); // 템플릿 엔진이 처리
});

module.exports = router;
