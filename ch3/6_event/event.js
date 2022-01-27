const EventEmitter = require('events');

const myEvent = new EventEmitter(); // event 객체 생성
myEvent.addListener('event1', () => { // on과 같음
    console.log('이벤트 1');
});
myEvent.on('event2', () => { // 이벤트 이름 설정, 이벤트 - 콜백 연결
    console.log('이벤트 2');
});
myEvent.on('event2', () => {
    console.log('이벤트 2 추가');
});
myEvent.once('event3', () => { // 실행을 한 번만 함! 
    console.log('이벤트 3');
})

myEvent.emit('event1'); // 이벤트 호출
myEvent.emit('event2'); // 이벤트 호출

myEvent.emit('event3'); // 이벤트 호출
myEvent.emit('event3'); // 실행 안됨 (once에 의해)

myEvent.on('event4', () => {
    console.log('이벤트 4');
});
myEvent.removeAllListeners('event4');
myEvent.emit('event4'); // 위의 문장에 의해 실행 안 됨

const listener = () => {
    console.log('이벤트 5');
};
myEvent.on('event5', listener);
myEvent.removeListener('event5', listener);
myEvent.emit('event5'); // 위에 문장에 의해 실행 안 됨

console.log(myEvent.listenerCount('event2')); // 위에 이벤트2, 이벤트2 추가를 만들어서 2가 출력