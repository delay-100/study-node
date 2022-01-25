// sequelize의 models와 동일
const mongoose = require('mongoose');

const {Schema} = mongoose;
const userSchema = new Schema({ // 스키마를 생성
    // _id를 기본 키로 생성하므로 _id 필드는 적어줄 필요가 없음
    name: {
        type: String, // 타입(자료형)을 String으로 지정
        require: true, // 필수
        unique: true, // 고유 값
    },
    age: {
        type: Number, // 타입을 Number로 지정
        require: true, 
    },
    married: {
        type: Boolean,
        required: true,
    },
    comment: String,
    createdAt: {
        type: Date,
        default: Date.now, // 기본 값: 데이터 생성 당시의 시간
    },
});

module.exports = mongoose.model('User',userSchema);