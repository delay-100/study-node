// sequelize의 테이블 만드는 것
const mongoose = require('mongoose');

const connect = () => {

    // 배포 환경이 아닌 경우(ex. 개발 환경) debug를 세팅함 - 몽구스가 생성하는 쿼리를 콘솔에 출력
    if (process.env.NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }

    // 몽구스와 몽고디비 연결
    mongoose.connect('mongodb://jiyeon:system@127.0.0.1:27017/admin', { // mongodb://이름:비밀번호@host:27017/admin
        dbName: 'nodejs', // 접속을 시도하는 주소의 데이터베이스
        useNewUrlParser: true, // 굳이 없어도 되는데 콘솔에 에러 뜨는 것 없애기1 
        useCreateIndex: true, // 굳이 없어도 되는데 콘솔에 에러 뜨는 것 없애기2
    }, (error) => {
        if (error){
            console.log('몽고디비 연결 에러', error);
        } else {
            console.log('몽고디비 연결 성공');
        }
    });
};
// 이벤트 리스너
mongoose.connection.on('error', (error) => {
    console.log('몽고디비 연결 에러', error); // 에러 발생 시 에러 내용을 기록하고,
});

mongoose.connection.on('disconnected', () =>{
    console.log('몽고디비 연결이 끊겼습니다. 연결을 재시도합니다.'); // 연결 종료 시 재연결 시도 
    connect();
});

module.exports = connect;