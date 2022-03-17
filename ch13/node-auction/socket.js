const SocketIO = require('socket.io');

module.exports = (server, app) => {
    const io = SocketIO(server, { path: '/socket.io '});
    app.set('io', io);
    io.on('connection', (socket) => { // 기본(/) 네임스페이스 연결
        const req = socket.request; // 경매 화면에서 실시간으로 입찰 정보를 올리기 위해 웹 소켓 사용
        const { headers: { referer }} = req; 
        const roomId = referer.split('/')[referer.split('/').length - 1]; // 클라이언트 연결 시 주소로부터 경매방 아이디를 받아와
        socket.join(roomId); // socket.join으로 해당 방에 입장

        socket.on('disconnect', () => { // 연결이 끊겼다면
            socket.leave(roomId); // socket.leave로 해당 방에서 나감
        });
    });
};