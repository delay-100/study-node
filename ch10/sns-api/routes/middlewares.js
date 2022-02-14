const jwt = require('jsonwebtoken'); // Json Web Token, Json 포맷을 이용하여 사용자에 대한 속성을 저장
const RateLimit = require('express-rate-limit'); // api 사용량 제한, sns-api 서버가 재시작되면 사용량이 초기화되므로 실제 서비스에서 사용량을 저장할 데이터베이스를 따로 마련하는 것이 좋음
                                                 // 보통 레디스가 많이 사용됨, 단, express-rate-limit은 데이터베이스와 연결하는 것을 지원하지 않으므로 npm에서 새로운 패키지를 찾거나 직접 구현해야 함

// 로그인이 된 상태를 확인하는 미들웨어
exports.isLoggedIn = (req, res, next) => {
    // 로그인이면 허용
    if(req.isAuthenticated()){ // req.isAuthenticated(): 로그인 중이면 true, 아니면 false
        next(); // 다음 미들웨어로 넘겨줌
    } else { // 로그인이 아니면 비허용
        res.status(403).send('로그인 필요');
    }
};

// 로그인이 되지 않은 상태를 확인하는 미들웨어
exports.isNotLoggedIn = (req, res, next) => {
    // 로그인이 아니면 허용
    if(!req.isAuthenticated()){
        next(); // 다음 미들웨어로 넘겨줌
    } else{ // 로그인이면 허용
        const message = encodeURIComponent('로그인한 컴포넌트입니다.');
        res.redirect(`/?error=${message}`); // 에러 페이지로 바로 이동시킴
    }
};

// 토큰 검증 미들웨어
exports.verifyToken = (req, res, next) => {
    try {
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET); // 요청 헤더에 저장된 토큰(req.headers.authorization) 사용, jwt.verify: 토큰 검증
                                                                                     // 첫 번째 인수: 토큰(토큰의 내용: 사용자 아이디, 닉네임, 발급자, 유효 기간), 두 번째 인수: 토큰의 비밀 키
                                                                                     // 토큰의 비밀 키가 일치하지 않으면/유효기간이 지난 경우 catch문으로 이동
        return next(); // 다음 미들웨어에서 req.decoded를 통해 토큰의 내용물을 사용할 수 있음
    } catch (error) {
        if (error.name == 'TokenExpiredError') { // 유효 기간 초과
            return res.status(419).json({ // 코드는 400번대 중 마음대로 정해도 됨
                code: 419,
                message: '토큰이 만료되었습니다',
            });
        }
        return res.status(401).json({ // 토큰의 비밀 키가 일치하지 않는 경우
            code: 401,
            message: '유효하지 않은 토큰입니다',
        });
    }
};

// console.log(RateLimit);
// apiLimiter 미들웨어 - 라우터에 넣으면 라우터에 사용량 제한이 걸림
exports.apiLimiter = new RateLimit({
    windowMs: 60 * 1000, // 기준 시간 - 1분 (1분에 1번 호출 가능)
    max: 10, // 허용 횟수 - 10번
    handler(req, res) { // 제한 초과 시 상태 코드(code)와 함께 허용량을 초과했다는 응답(message)을 전송하는 콜백 함수
        res.status(this.statusCode).json({
            code: this.statusCode, // 기본값 429
            message: '1분에 한 번만 요청할 수 있습니다.',
        });
    },
});

// deprecated 미들웨어 - 사용하면 안 되는 라우터에 붙혀줌
exports.deprecated = ( req, res ) => {
    res.status(410).json({ // 410 코드와 함께 새로운 버전을 사용하라는 메세지를 응답함
        code: 410,
        message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
    });
};
