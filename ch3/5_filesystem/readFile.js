const fs = require('fs'); // fs는 기본적으로 콜백 형식

fs.readFile('./readme.txt', (err, data) => { // 파일의 경로가 현재 파일 기준이 아닌, node명령어를 실행하는 콘솔 기준임
    if(err){
        throw err;
    }
    console.log(data); // Buffer 출력
    console.log(data.toString()); // 문자열로 변환 후 출력
})