// promise.js를 변형해 만든 연속된 then 사용 예

const condition = true; // true면 resolve, false면 reject
const promise = new Promise((resolve, reject) => { // resolve, reject를 매개변수로 갖는 call back함수
    if(condition){
        resolve('성공');
    } else{
        reject('실패');
    }
});

promise
    .then((message)=> {
        return new Promise((resolve, reject) => {
            resolve(message);
        });
    })
    .then((message2)=> {
        return new Promise((resolve, reject) => {
            resolve(message2);
        });
    })
    .then((message3) => {
        console.log(message3);
    })
    .catch((error) => {
        console.error(error); // 실패(reject)한 경우 실행
    });