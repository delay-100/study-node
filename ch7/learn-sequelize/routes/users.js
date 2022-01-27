const express = require('express');
const User = require('../models/user');
const Comment = require('../models/comment');

const router = express.Router();

router.route('/')
    .get(async (req, res, next) => {
        try {
            const users = await User.findAll();
            res.json(users);
        } catch(err){
            console.error(err);
            next(err);
        }
    })
    .post(async (req, res, next) => {
        try {
            const user = await User.create({ // 유저모델 생성
                name: req.body.name, // sequelize.js에서 전송받은 name값을 가져옴
                age: req.body.age, // sequelize.js에서 전송받은 age값을 가져옴
                married: req.body.married, // sequelize.js에서 전송받은 married값을 가져옴
            });
            console.log(user);
            res.status(201).json(user); // 성공 user(응답) 전송
        } catch(err){
            console.error(err);
            next(err);
        }   
    });

// id에 맞는 comments들이 반환됨
router.get('/:id/comments', async(req, res, next) => { 
    try{
        const comments = await Comment.findAll({
            include: {
                model: User,
                where: { id: req.params.id },
            },
        });
        console.log(comments);
        res.json(comments);
    } catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;