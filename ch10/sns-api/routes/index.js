const express = require('express');
const { v4: uuidv4 } = require('uuid'); // uuidv4를 가져오면서 v4로 이름을 바꾸며 가져옴
const {User, Domain } = require('../models');
const { isLoggedIn } = require('./middlewares');

const router = express.Router();

// GET / 요청 - 접속 시 로그인 화면을 보여줌
router.get('/', async (req, res, next) => {
    try {
        const user = await User.findOne({ 
            where: { id: req.user && req.user.id || null},
            include: { model: Domain }, // 해당 Domain을 가진 User가 있는지 검색  
        });
        res.render('login', {
            user,
            domains: user && user.Domains, // user 객체가 있는지 체크해야 서버에서 오류가 나지 않기때문에 user으로 확인을 먼저 해줌
        });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

// POST /domain 요청 - 도메인 등록 라우터
router.post('/domain', isLoggedIn, async (req, res, next) => {
    try {
        await Domain.create({
            UserId: req.user.id,
            host: req.body.host,
            type: req.body.type,
            clientSecret: uuidv4(), // clientSecret 값을 uuid 패키지(버전 4-36자리 문자열 형식으로 생김)를 통해 생성, 세 번째 마디의 첫 번째 숫자가 4
        });
        res.redirect('/');
    } catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;