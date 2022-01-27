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
        console.log(message); // 성공(resolve)한 경우 실행
    })
    .catch((error) => {
        console.error(error); // 실패(reject)한 경우 실행
    })
    .finally(() => { // 성공/실패 여부와 상관없이 무조건 실행
        console.log('무조건');
    });