const express = require('express');
const axios = require('axios');

const router = express.Router();
// const URL = 'http://localhost:8002/v1';
const URL = 'http://localhost:8002/v2';
axios.defaults.headers.origin = 'http://localhost:4000'; // 요청의 헤더 origin값을 localhost:4000으로 설정 - 어디서 요청하는지 파악하기 위해 사용, 주소가 바뀌면 이 값도 바꾸면 됨 

// request 함수: sns API에 요청을 보내는 함수
const request = async (req, api) => {
    try {
        if(!req.session.jwt) { // 세션에 토큰이 없으면 
            const tokenResult = await axios.post(`${URL}/token`, { // sns-api/routes/v1.js의 post /token 실행
                clientSecret: process.env.CLIENT_SECRET, // clientSecret을 사용해 토큰을 발급받는 요청을 보냄
            });
            req.session.jwt = tokenResult.data.token; // 토큰을 재사용하기 위해 세션에 토큰 저장
        }
        return await axios.get(`${URL}${api}`, { 
            headers: { authorization: req.session.jwt},
        }); // 토큰을 이용해 API 요청 - sns-api/routes/v1.js의 get /api값 실행
    } catch (error) {
        if (error.response.status === 419) { // 토큰 만료 시 419 에러가 발생하는데, 419: sns-api/routes/middlewares.js의 verifyToken내에 정의됨
            delete req.session.jwt; // 토큰을 지우고
            return request(req, api); // 토큰 재발급 받기(만료 시 계속 재귀적으로 실행)
        } // 419 외의 다른 에러면
        return error.response;
    }
};

// API를 사용해 자신이 작성한 포스트를 JSON 형식으로 가져오는 라우터 - 현재는 JSON으로만 응답하지만 템플릿 엔진으로 화면을 렌더링 가능
router.get('/mypost', async (req, res, next) => {
    try {
        const result = await request(req, '/posts/my'); // 위에 선언한 reqquest 함수 실행
        res.json(result.data);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// API를 사용해 해시태그가 달린 게시글들을 검색를 검색하는 라우터
router.get('/search/:hashtag', async (req, res, next) => {
    try {
        const result = await request(
            req, `/posts/hashtag/${encodeURIComponent(req.params.hashtag)}`,  // 위에 선언한 reqquest 함수 실행
        );
        res.json(result.data);
    } catch (error){
        if (error.code) {
            console.error(error);
            next(error);
        }
    }
});

// nodeplus 서비스가 토큰 인증 과정을 테스트해보는 라우터
router.get('/test', async (req, res, next) => {
    try {
        if (!req.session.jwt) { // 세션에 토큰이 없으면 토큰 발급, jwt는 sns-api/routes/v1.js에서 const token = jwt.sign({ 로 만들어줌
            const tokenResult = await axios.post('http://127.0.0.1:8002/v1/token', {
                clientSecret: process.env.CLIENT_SECRET, // HTTP 요청 본문에 클라이언트 비밀 키를 실어 보냄, const { clientSecret } = req.body; 
            });
            if (tokenResult.data && tokenResult.data.code === 200) { // 토큰 발급 성공, sns-api/routes/v1.js의 200 코드가 return 된 경우
                req.session.jwt = tokenResult.data.token; // 세션에 토큰 저장
            } else { // 토큰 발급 실패
                return res.json(tokenResult.data); // 발급 실패 사유 응답
            }
        }
        // 발급 받은 토큰이 유효한지 테스트
        const result = await axios.get('http://127.0.0.1:8002/v1/test', {
            headers: { authorization: req.session.jwt }, // 인증용 토큰 헤더는 보통 요청 본문 대신에, authorization에 넣어 전송함 
                                                        // 본문에 객체를 붙인 포스트 요청을 보내고
                                                         // 추가적으로 헤더 이름 'Authorization'을 추가하고 로그인 후 sessionStorage에 저장된 jwt 토큰 값을 제공하여 헤더 정보를 전달
                                                         // 출처 : https://medium.com/geekculture/how-to-implement-user-authentication-using-jwt-json-web-token-in-nodejs-and-maintain-user-c5850aed8839
        });
        return res.json(result.data);
    }
    catch (error){
        console.error(error);
        if(error.response.status === 419) {// 토큰 만료 시, sns-api/routes/middlewares.js의 419 코드
            return res.json(error.response.data);
        }
        return next(error);
    }
});

router.get('/', (req, res) => {
    res.render('main', { key: process.env.CLIENT_SECRET});
});

module.exports = router;