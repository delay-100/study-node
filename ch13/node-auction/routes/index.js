const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const schedule = require('node-schedule'); 

const { Good, Auction, User, sequelize } = require('../models');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');

const router = express.Router();

router.use((req, res, next) => {
    res.locals.user = req.user;
    next();
});

router.get('/', async (req, res, next) => {
    try {
        const goods = await Good.findAll({ where: { SoldId: null }});
        res.render('main', {
            title: 'NodeAuction',
            goods,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

router.get('/join', isNotLoggedIn, (req, res) => {
    res.render('join', {
        title: '회원가입 - NodeAuction',
    });
});

router.get('/good', isLoggedIn, (req, res) => {
    res.render('good', { title: '상품 등록 - NodeAuction'});
});

try {
    fs.readdirSync('uploads');
} catch (error) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}
const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, cb) {
            cb(null, 'uploads/');
        },
        filename(req, file, cb) {
            const ext = path.extname(file.originalname);
            cb(null, path.basename(file.originalname, ext) + new Date().valueOf() + ext);
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024 },
});

router.post('/good', isLoggedIn, upload.single('img'), async (req, res, next) => { 
    try {
        const { name, price } = req.body;
        const good = await Good.create({
            OwnerId: req.user.id,
            name,
            img: req.file.filename,
            price,
        });
        const end = new Date();
        end.setDate(end.getDate()+1); // 하루 뒤
        schedule.scheduleJob(end, async () => { // 첫 번째 인수(end): 실행될 시각, 두 번째 인수: 해당 시각이 되었을 때 수행할 콜백 함수
                                                // schedule 객체의 scheduleJob 메서드로 일정을 예약할 수 있음
            const success = await Auction.findOne({ // 가장 높은 가격으로 입찰한 사람을 찾아 낙찰자 찾음
                where: { GoodId: good.id },
                order: [['bid', 'DESC']],
            });
            await Good.update({ SolidId: success.UserId }, { where: { id: good.id }}); // 낙찰자 아이디를 넣음 
            await User.update( {
                money: sequelize.literal(`money - ${success.bid}`), // { 컬럼: sequelize.literal(컬럼 - 숫자)}: 시퀄라이즈에서 해당 컬럼의 숫자를 줄이는 방법
                                                                    // 숫자를 늘리려면 - 대신 + 하면 됨
            }, {
                where: { id: success.UserId },
            });
        });
        res.redirect('/');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 해당 상품과 기존 입찰 정보들을 불러온 뒤 렌더링
router.get('/good/:id', isLoggedIn, async (req, res, next) => {
    try {
        const [good, auction] = await Promise.all([
            Good.findOne({
                where: { id: req.params.id },
                include: { // 상품모델에 사용자 모델을 include할 때
                    model: User,
                    as: 'Owner',  // Owner과 Solid가 있으므로 어떤 관계를 include할지 적어주어야 함
                },
            }),
            Auction.findAll({
                where: { GoodId: req.params.id },
                include: { model: User },
                order: [['bid', 'ASC']],
            }),
        ]);
        res.render('auction', {
            title: `${good.name} - NodeAuction`,
            good,
            auction,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// 클라이언트로부터 받은 입찰 정보를 저장
router.post('/good/:id/bid', isLoggedIn, async (req, res, next) => {
    try {
        const { bid, msg } = req.body;
        const good = await Good.findOne({
            where: { id: req.params.id },
            include: { model: Auction },
            order: [[{ model: Auction }, 'bid', 'DESC']], // include될 모델의 컬럼을 정렬, Auction 모델의 bid를 내림차순으로 정렬
        });
        if (good.price >= bid) {
            return res.status(403).send('시작 가격보다 높게 입찰해야 합니다.');
        }
        if (new Date(good.createdAt).valueOf() + ( 24 * 60 * 60 * 1000 ) < new Date()) {
            return res.status(403).send('경매가 이미 종료되었습니다');
        }
        if (good.Auctions[0] && good.Auctions[0].bid >= bid ){
            return res.status(403).send('이전 입찰가보다 높아야 합니다');
        }
        const result = await Auction.create({
            bid,
            msg, 
            UserId: req.user.id,
            GoodId: req.params.id,
        });
        // 정상적인 사용자가 들어오면 웹 소켓으로 실시간으로 입찰 내역 전송
        req.app.get('io').to(req.params.id).emit('bid', {
            bid: result.bid,
            msg: result.msg,
            nick: req.user.nick,
        });
        return res.send('ok');
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// 낙찰자가 낙찰 내역을 볼 수 있도록 함
router.get('/list', isLoggedIn, async (req, res, next) => {
    try {
        const goods = await Good.findAll({
            where: { SoldId: req.user.id },
            include: { model: Auction },
            order: [[{ model: Auction }, 'bid', 'DESC']], // 입찰 내역을 내림차순으로 정렬해 낙찰자의 내역이 가장 위에 오도록 함
        });
        res.render('list', { title: '낙찰 목록 - NodeAuction', goods}); // 낙찰된 상품과 그 상품의 입찰 내역을 조회한 후 렌더링 함
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;