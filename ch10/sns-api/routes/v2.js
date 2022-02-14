// api 사용량 제한을 추가한 v2 라우터
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

// 응답에 Access-Control-Allow-Origin 헤더가 추가됨
// v2의 모든 라우터에 적용
router.use(cors({
    credentials: true, // true: 다른 도메인과 쿠키가 공유됨, 서버 간의 도메인이 다른 경우에는 이 옵션을 활성화하지 않으면 로그인이 되지 않을 수 있음
                       // axios에서도 도메인이 다른데, 쿠키를 공유해야 하는 경우 withCredentials: true 옵션으로 요청을 보내야 함
}));

router.post('/token', apiLimiter, async (req, res) => { // apiLimiter: routes/middlewares.js의 사용량 제한 미들웨어 추가
    const { clientSecret } = req.body;
    try {
        const domain = await Domain.findOne({
            where: { clientSecret },
            include: {
                model: User,
                attribute: ['nick', 'id'],
            },
        });
        if (!domain) {
            return res.status(401).json({
                code: 401,
                message: '등록되지 않은 도메인입니다. 먼저 도메인을 등록하세요',
            });
        }
        const token = jwt.sign({
            id: domain.User.id,
            nick: domain.User.nick,
        }, process.env.JWT_SECRET, {
            expiresIn: '30m', // 토큰의 유효기간을 30분으로 늘림
            issuer: 'nodebird',
        });
        return res.json({
            code: 200,
            message: '토큰이 발급되었습니다',
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

router.get('/test', verifyToken, apiLimiter, (req, res) => {
    res.json(req.decoded);
});

router.get('/posts/my', apiLimiter, verifyToken, (req, res) => {
    Post.findAll({ where: { userId: req.decode.id}})
      .then((posts) => {
          console.log(posts);
          res.json({
              code: 200,
              payload: posts,
          });
      })
      .catch((error) => {
          console.error(error);
          return res.status(500).json({
              code: 500,
              message: '서버 에러',
          });
      });
});

router.get('/posts/hashtag/:title', verifyToken, apiLimiter, async (req, res) => {
    try {
        const hashtag = await Hashtag.findOne({ where: { title: req.params.title }});
        if (!hashtag) {
            return res.status(404).json({
                code: 404,
                message: '검색 결과가 없습니다',
            });
        }
        const posts = await hashtag.getPosts();
        return res.json({
            code: 200,
            payload: posts,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            code: 500,
            message: '서버 에러',
        });
    }
});

module.exports = router;