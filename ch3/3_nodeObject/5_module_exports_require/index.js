// var.js와 func.js를 모두 참조함

const { odd, even } = require('./var');
const checkNumber = require('./func'); // func.js에서는 이름이 checkOddOrEven인데 여기서는 checkNumber로 사용

function checkStringOddOrEven(str){
    if(str.length %2){ // str.length가 홀수면 계산 값이 1이어서 if문 실행, (true : 1, false : 0)
        return odd;
    }
    return even;
}

console.log(checkNumber(10));
console.log(checkStringOddOrEven('hello'));