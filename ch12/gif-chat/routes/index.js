const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const Room = require('../schemas/room');
const Chat = require('../schemas/chat');

const router = express.Router();

// GET / 라우터 - 메인 화면 렌더링
router.get('/', async (req, res, next) => {
    try {
        const rooms = await Room.find({});
        res.render('main', { rooms, title: 'GIF 채팅방'});
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// GET /room 라우터 - 채팅방 생성 화면 렌더링
router.get('/room', (req, res) => {
    res.render('room', { title: 'GIF 채팅방 생성'});
});

// POST /room 라우터 - 채팅방을 만들기
router.post('/room', async (req, res, next) => {
    try {
        const newRoom = await Room.create({
            title: req.body.title,
            max: req.body.max,
            owner: req.session.color,
            password: req.body.password,
        });
        const io = req.app.get('io'); // app.set('io', io)로 저장한 io 객체를 req.app.get('io')로 가져옴
        io.of('/room').emit('newRoom', newRoom); // /room 네임스페이스에 연결한 모든 클라이언트에 데이터를 보내는 메서드, of 메서드: Socket.IO에 다른 네임스페이스를 부여하는 메서드
                                                 // 네임스페이스가 없는 경우에는 io.emit 메서드로 모든 클라이언트에 데이터를 보낼 수 있음
        res.redirect(`/room/${newRoom._id}?password=${req.body.password}`); // GET / 라우터에 접속한 모든 클라이언트가 새로 생성된 채팅방에 대한 데이터를 받을 수 있음
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// GET /room/:id 라우터 - 렌더링 전에 방이 존재하는지, 비밀 방이면 비밀번호가 맞는지, 허용인원 초과하지 않았는지 검사
router.get('/room/:id', async (req, res, next) => {
    try {
        const room = await Room.findOne({ _id: req.params.id });
        const io = req.app.get('io');

        if(!room) {
            return res.redirect('/?error=존재하지 않는 방입니다.');
        }
        if(room.password && room.password !== req.query.password) {
            return res.redirect('/?error=비밀번호가 틀렸습니다.');
        }
        const { rooms } = io.of('/chat').adapter; // io.of('/chat').adapter.rooms: 방 목록이 들어있음
        // console.log('zzzzzzzzzz');
        // console.log(rooms);
        if (rooms && rooms[req.params.id] && room.max <= rooms[req.params.id].length) { // io.of('/chat').adapter.rooms[req.params.id]: 해당 방의 소켓 목록이 나옴
                                                                                        // 소켓의 수를 세서 참가 인원의 수를 알아낼 수 있음
            return res.redirect('/?error=허용 인원이 초과하였습니다.');
        }
        const chats = await Chat.find({ room: room._id}).sort('createdAt'); // DB로부터 채팅내역을 가져옴
        // console.log('zzzzzzzzzz');
        // console.log(rooms[req.params.id]);
        return res.render('chat', {
            room,
            title: room.title,
            chats, // chats: chats
            user: req.session.color,
            member: rooms && rooms[req.params.id],
        });
    } catch (error) {
        console.error(error);
        return next(error);
    }
});

// DELETE /room/:id - 채팅방을 삭제하는 라우터
router.delete('/room/:id', async (req, res, next) => {
    try {
        await Room.remove({ _id: req.params.id });
        await Chat.remove({ room: req.params.id });
        res.send('ok');
        setTimeout(() => { // 2초뒤에 
            req.app.get('io').of('/room').emit('removeRoom', req.params.id); // 웹 소켓으로 /room 네임스페이스에 방이 삭제되었음(removeRoom)을 알림
        }, 2000);
    } catch (error) {
        console.error(error);
        next(error);
    }
});

// POST /room/:id/chat - 방 접속 시 기존 채팅 내역을 불러오도록 하는 라우터
// 채팅을 할 때마다 채팅 내용이 이 라우터로 전송되고, 라우터에서 다시 웹 소켓으로 메세지를 보냄
router.post('/room/:id/chat', async (req, res, next) => {
    try {
        const chat = await Chat.create({ // 채팅을 db에 저장
            room: req.params.id,
            user: req.session.color,
            chat: req.body.chat,
        }); 
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat); // 같은 방(req.params.id)에 들어있는 소켓들에게 메시지 데이터를 전송
        res.send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

try {
    fs.readdirSync('uploads');
} catch (err) {
    console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
    fs.mkdirSync('uploads');
}

const upload = multer({
    storage: multer.diskStorage({
        destination(req, file, done) {
            done(null, 'uploads/');
        },
        filename(req, file, done) {
            const ext = path.extname(file.originalname);
            done(null, path.basename(file.originalname, ext) + Date.now() + ext); // 파일명에 타임스탬프(Date.now())를 붙힘
        },
    }),
    limits: { fileSize: 5 * 1024 * 1024}, // 용량을 5MB로 제한
});

// POST /room/{{room._id}}/gif - views/chat.html에서 보낸 gif내용 처리
router.post('/room/:id/gif', upload.single('gif'), async (req, res, next) => {
    try {
        const chat = await Chat.create({
            room: req.params.id,
            user: req.session.color,
            gif: req.file.filename,
        });
        req.app.get('io').of('/chat').to(req.params.id).emit('chat', chat);
        res.send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;