const timeout = setTimeout(() => {
    console.log('1.5초 후 실행');
}, 1500);

const interval = setInterval(() => {
    console.log('1초마다 실행');
}, 1000);

const timeout2 = setInterval(() => {
    console.log('실행되지 않습니다');
}, 3000);

setTimeout(() => {
    clearTimeout(timeout2); // timeout2는 3초를 주기로 출력이 되는데, 2.5초만에 취소했으므로 실행되지 않음
    clearInterval(interval); // 1초마다 실행이 2번(2초) 반복된 후, 2.5초가 되면 취소되므로 이후로는 실행되지 않음
}, 2500);

const immediate = setImmediate(() => {
    console.log('즉시 실행');
});

const immediate2 = setImmediate(() => {
    console.log('실행되지 않습니다');
});

clearImmediate(immediate2); // 즉시 실행을 취소했기 때문에 실행되지 않음