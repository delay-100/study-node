// 최상위 스코프에 존재하는 this
console.log(this); // {}
console.log(this === module.exports); // true
console.log(this === exports) // true

// 함수 선언문 내부의 this
function whatIsThis() {
    console.log('function', this === exports, this === global);
}

whatIsThis(); // function false true