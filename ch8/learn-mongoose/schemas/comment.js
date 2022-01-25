const mongoose = require('mongoose');

const { Schema } = mongoose; 
const { Types: { ObjectId} } = Schema;
const commentSchema = new Schema({
    commenter: { 
        type: ObjectId, 
        require: true,
        ref: 'User', // 스키마의 사용자 ObjectId가 들어감 - 몽구스가 JOIN과 비슷한 기능을 할 때 사용됨
    },
    comment: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now, // 데이터 생성 당시 시간
    },
});

module.exports = mongoose.model('Comment', commentSchema);