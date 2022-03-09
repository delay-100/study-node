// 채팅방 스키마

const mongoose = require('mongoose');

const { Schema } = mongoose;
const roomSchema = new Schema({
    title: { // 방 제목
        type: String,
        required: true,
    },
    max: { // 최대 수용 인원
        type: Number,
        required: true,
        default: 10, // 기본적으로 10명
        min: 2, // 최소 인원 2명
    },
    owner: { // 방장
        type: String,
        required: true,
    },
    password: String, // 비밀번호, 없어도 되므로 required 속성 필요x
    createdAt: { // 생성 시간
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Room', roomSchema);