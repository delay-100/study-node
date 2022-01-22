const express = require('express');
const { Comment } = require('../models');

const router = express.Router();

router.post('/', async (req, res, next) => {
    try {
        const comment = await Comment.create({ // Comment 모델 생성
            commenter: req.body.id, // foreignKey 저장
            comment: req.body.comment,
        });
        console.log(comment);
        res.status(201).json(comment);
    } catch(err){
        console.error(err);
        next(err);
    }
});

router.route('/:id')
    .patch(async (req, res, next) => {
        try {
            const result = await Comment.update({ 
                comment: req.body.comment, // comment의 comment 값을 수정
            }, {
                where: {id: req.params.id}, // params는 :을 가리킴 즉, '/:id'로 온 req.params.id와 일치하는 사용자id
            });
            res.json(result);
        } catch(err){
            console.error(err);
            next(err);
        }
    })
    .delete(async (req, res, next)=>{
        try {
            const result = await Comment.destroy({ 
                where: { id: req.params.id }
            });
            res.json(result);
        } catch(err){
            console.error(err);
            next(err);
        }
    });

module.exports = router;