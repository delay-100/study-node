// 라우터의 이름: v1(버전 1)

const express = require('express');
const jwt = require('jsonwebtoken'); // JWT 토큰 인증

const { verifyToken } = require('./middlewares');
const { Domain, User } = require('../models');

const router = express.Router();

// 토큰을 발급하는 라우터
router.post('/token', async (req, res) => {
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({ // 전달받은 클라이언트 비밀 키로 도메인이 등록된 것인지를 확인
            where: { clientSecret },
            include: {
                model: User,
                attribute: ['nick', 'id'],
            },
        });
        if(!domain) {
            return res.status(401).json({
                code: 401,  // HTTP 상태 코드를 사용해도 되고, 임의로 숫자를 부여해도 됨
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요.', // 사용자가 어떤 문제인지 알 수 있게 message도 보냄
            });
        }
        const token = jwt.sign({  // jwt.sign의 첫 번째 인수: 토큰의 내용
            id: domain.User.id, // 사용자의 id
            nick: domain.User.nick, // 사용자의 nickname
        }, process.env.JWT_SECRET, { // jwt.sign의 두 번째 인수: 토큰의 비밀 키, 세 번째 인수: 토큰의 설정
            expiresIn: '1m', // 토큰의 유효 기간을 1분으로 설정, 60*1000처럼 밀리초 단위로 적어도 됨
            issuer: 'sns', // 발급자
        });
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다.', 
            token,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

// 사용자가 발급받은 토큰을 테스트해볼 수 있는 라우터
router.get('/test', verifyToken, (req, res) => { // verifyToken: routes/middlewares.js 에서 토큰 검증
    res.json(req.decoded); // 검증 성공 시 토큰의 내용물을 응답으로 보냄, json 형태: code, message 속성 존재(+token이 있으면 token 속성도 존재)
});

module.exports = router;