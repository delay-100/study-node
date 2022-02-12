const jwt = require('jsonwebtoken');

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