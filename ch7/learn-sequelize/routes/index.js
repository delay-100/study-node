const express = require('express');
const User = require('../models/user');

const router = express.Router();

// '/' get 요청
router.get('/', async (req,res,next) =>{
    try{
        const users = await User.findAll(); // 모든 유저를 찾아서 sequelize.html에 users로 렌더링
        res.render('sequelize', {users});
    } catch(err){
        console.error(err);
        next(err);
    }
});

module.exports = router;