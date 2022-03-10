// 채팅 스키마

const mongoose = require('mongoose');

const { Schema } = mongoose;
const { Types: { ObjectId }} = Schema;
const chatSchema = new Schema({
    room: { // 채팅방 아이디
        type: ObjectId,
        required: true,
        ref: 'Room', // Room 스키마와 연결해 Room 컬렉션의 ObjectId가 들어가게 됨
    },
    user: { // 채팅을 한 사람
        type: String,
        required: true,
    },
    // chat과 gif는 둘 중 하나만 저장하면 돼서 required 속성x
    chat: String, // 채팅 내역
    gif: String, // GIF 이미지 주소
    createdAt: { // 채팅 시간
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Chat', chatSchema);