#!/usr/bin/env node
// console.log('Hello CLI', process.argv); // 옵션 목록이 배열로 표시됨
const readline = require('readline');

const rl = readline.createInterface({ // rl 객체 생성
    input: process.stdin, // 콘솔 입력
    output: process.stdout, // 콘솔 출력
});

console.clear();
const answerCallback = (answer) => {
    if (answer === 'y') {
        console.log('감사합니다!');
        rl.close();
    } else if (answer === 'n') {
        console.log('죄송합니다!');
        rl.close();
    } else {
        console.clear(); // 콘솔 내용을 모두 지우고 다시 입력 받게 함
        console.log('y 또는 n만 입력하세요.');
        rl.question('예제가 재미있습니까? (y/n)', answerCallback);
    }
};

rl.question('예제가 재미있습니까? (y/n) ', answerCallback);

// rl.question('예제가 재미있습니까? (y/n) ', (answer) => { // 첫 번째 인수: 질문 내용, 두 번째 인수: 콜백 함수
//     if (answer === 'y') {
//         console.log('감사합니다!');
//     } else if (answer === 'n'){
//         console.log('죄송합니다!');
//     } else {
//         console.log('y 또는 n만 입력하세요.');
//     }
//     rl.close(); // question 메서드 종료
// });

