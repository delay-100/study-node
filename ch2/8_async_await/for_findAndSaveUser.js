const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
(async () => {
    for await (promise of [promise1, promise2]){ // for await of문을 사용해 프로미스 배열을 순회하는 모습
        console.log(promise);
    }
})();