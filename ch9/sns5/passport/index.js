const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {

    // 세션에 불필요한 데이터를 담아두지 않기 위한 과정들(serializeUser, deserializeUser)

    // serializeUser: 사용자 정보 객체를 세션에 아이디로 저장
    passport.serializeUser((user,done) => { // serializeUser: 로그인 시 실행됨, req.session(세션) 객체에 어떤 데이터를 저장할지 정하는 메서드
        done(null, user.id); // done 첫 번째 인수: 에러 발생 시 사용, done 두 번째 인수: 저장하고 싶은 데이터를 넣음
                             // user.id만 저장한 이유: 세션에 user의 모든 정보를 저장하면 서버의 용량이 낭비되기 때문
    });
    
    // deserializeUser: 세션에 저장한 아이디를 통해 사용자 정보 객체를 불러옴
    // passport.session 미들웨어가 이 메소드를 호출
    passport.deserializeUser((id, done) => { // deserializeUser: 매 요청 시 실행, id: serializerUser의 done으로 id 인자를 받음
        User.findOne({where:{id}}) // db에 해당 id가 있는지 확인
        .then(user => done(null, user)) // req(요청).user에 저장 -> 앞으로 req.user을 통해 로그인한 사용자의 정보를 가져올 수 있음
        .catch(err => done(err));
    });     

    local();
    kakao();
};