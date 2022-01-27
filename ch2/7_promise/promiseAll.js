const promise1 = Promise.resolve('성공1');
const promise2 = Promise.resolve('성공2');
Promise.all([promise1, promise2])
    .then((result) => { // result 매개변수에 각각의 프로미스 결괏값이 배열로 들어있다.
        console.log(result); // ['성공1', '성공2'];
    })
    .catch((error) => { // Promise 중 하나라도 reject가 되면 catch로 넘어온다.
        console.error(error);
    });