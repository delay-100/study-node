// 웹 소켓 로직이 들어있음
// ws 웹 소켓 - 양방향 통신이므로 client에도 작성해줘야 함 views/index.html
const WebSocket = require('ws');

module.exports = (server) => { // server: app.js에서 넘겨준 서버
    const wss = new WebSocket.Server({ server });  // express 서버를 웹 소켓 서버와 연결함
                                                   // express(HTTP)와 웹 소켓(WS)은 같은 포트를 공유할 수 있으므로 별도의 작업 필요X
    
    wss.on('connection', (ws, req) => { // 연결 후 웹 소켓 서버(wss)에 이벤트 리스너를 붙힘 - connection 이벤트
                                        // 웹 소켓은 이벤트 기반으로 작동되므로 항상 대기해야 함
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; // req.headers['x-forwarded-for'] || req.connection.remoteAddress: 클라이언트의 IP를 알아내는 유명한 방법 중 하나
                                                                                   // express에서는 IP 확인 시 proxy-addr 패키지를 사용하므로 이 패키지(proxy-addr) 사용해도 괜찮음
                                                                                   // localhost 접속 시 크롬에서 IP가 ::1로 뜸, 다른 브라우저는 ::1외에 다른 IP가 뜰 수 있음
        console.log('새로운 클라이언트 접속', ip);

        // 이벤트 리스너(message, error, close) 세 개 연결
        ws.on('message', (message) => { // 클라이언트로부터 메시지 수신 시(메시지 왔을 때 발생), 클라이언트의 onmessage 실행 시 실행됨
            console.log(message.toString());
        });
        ws.on('error', (error) => { // 에러 시(웹 소켓 연결 중 문제가 발생한 경우)
            console.error(error);
        });
        ws.on('close', () => { // 연결 종료 시(클라이언트와 연결 끊겼을 때 발생)
            console.log('클라이언트 접속 해제', ip);
            clearInterval(ws.interval); // setInterval을 clearInterval로 정리 - 안 적어주면 메모리 누수 발생
        });

        ws.interval = setInterval(() => { // 3초마다 연결된 모든 클라이언트로 메시지 전송
            if(ws.readyState == ws.OPEN) { // OPEN(열림) - OPEN일때 만 에러 없이 메시지 전송 가능
                                           // + CONNECTION(연결 중), CLOSING(닫는 중), CLOSED(닫힘)
                ws.send('서버에서 클라이언트로 메시지를 보냅니다.'); 
            }
        }, 3000);
    });
};