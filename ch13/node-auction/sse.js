const SSE = require('sse');

module.exports = (server) => {
    const sse = new SSE(server); // express 서버와 sse 연결
    sse.on('connection', (client) => { // 생성된 sse 객체에 connection 이벤트 리스너를 연결해 클라이언트와 연결 시 어떤 동작 할지 정의 가능
                                       // client 객체: 클라이언트에 메시지를 보낼 때 사용하는 객체
                                       // 라우터에서 client 객체를 사용하고 싶다면 app.set메서드로 client 객체를 등록 후 req.app.get 메서드를 사용하면 됨
        setInterval(() => {
            client.send(Date.now().toString()); // 1초마다 접속한 클라이언트에 서버 시간 타임스탬프를 보내도록 함(client.send 메서드 이용)
                                                // client.send는 문자열만 보낼 수 있어서 toString해줌
        }, 1000);
    });
};

