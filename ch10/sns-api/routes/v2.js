// api 사용량 제한을 추가한 v2 라우터
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const url = require('url');

const { verifyToken, apiLimiter } = require('./middlewares');
const { Domain, User, Post, Hashtag } = require('../models');

const router = express.Router();

router.use(async (req, res, next) => {
    // console.log(req.get('origin'));
    // console.log('==============origin==========')
    const domain = await Domain.findOne({ // 도메인 모델로 클라이언트의 도메인(req.get('origin'))과 호스트가 일치하는 것이 있는지 검사
        where: { host: url.parse(req.get('origin')).host}, // http나 https 같은 프로토콜을 떼어낼 때는 url.parse 메서드를 사용
    });
    if (domain) {
        cors({ // 일치하는 것이 있다면 CORS를 허용해서 다음 미들웨어로 보냄
            origin: req.get('origin'), // origin속성: 허용할 도메인을 적음, *처럼 모든 도메인을 허용하지 않고 기입한 도메인만 허용, 여러 개의 도메인은 배열을 사용
                                       // 특정한 도메인만 허용하므로 허용되지 않은 도메인에서 요청을 보내는 것을 차단
            credentials: true,
        }) (req, res, next);
        // 다음의 두 코드는 같은 역할을 함
        // 1. router.user(cors()); 
        // 2. router.use((req, res, next) => {
        // cors()(req, res, next); 
        // });
    } else { // 일치하는 것이 없으면 CORS 없이 next 호출
        next();
    }
});

// // 응답에 Access-Control-Allow-Origin 헤더가 추가됨
// // v2의 모든 라우터에 적용
// router.use(cors({
//     credentials: true, // true: 다른 도메인과 쿠키가 공유됨, 서버 간의 도메인이 다른 경우에는 이 옵션을 활성화하지 않으면 로그인이 되지 않을 수 있음
//                        // axios에서도 도메인이 다른데, 쿠키를 공유해야 하는 경우 withCredentials: true 옵션으로 요청을 보내야 함
// }));

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
            issuer: 'sns',
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