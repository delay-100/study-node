// mongodb와 연결
const mongoose = require('mongoose');

const { MONGO_ID, MONGO_PASSWORD, NODE_ENV } = process.env; // 보안을 위해 정보 분리
const MONGO_URL = `mongodb://${MONGO_ID}:${MONGO_PASSWORD}@localhost:27017/admin`;

const connect = () => {
     // 배포 환경이 아닌 경우(ex. 개발 환경) debug를 세팅함 - 몽구스가 생성하는 쿼리를 콘솔에 출력
    if (NODE_ENV !== 'production') {
        mongoose.set('debug', true);
    }
    // 몽구스와 몽고디비 연결
    mongoose.connect(MONGO_URL, {
        dbName: 'gifchat', // 접속을 시도하는 주소의 데이터베이스
        useNewUrlParser: true, // 굳이 없어도 되는데 콘솔에 에러 뜨는 것 없애기1 
        useCreateIndex: true, // 굳이 없어도 되는데 콘솔에 에러 뜨는 것 없애기2
    }, (error) => {
        if (error) {
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