// 입력
if (true) {
    var y = 3;
  }
console.log(y); 
// 출력
// Uncaught ReferenceError: y is not defined // error! 블록 밖에서는 변수에 접근 불가

// 입력2
const a = 0;
a = 1; 
// 출력2
// Uncaught TypeError: Assignment to constant variable. // error! 다른 값을 할당하려 함

// 입력3
const c; 
//출력3
// Uncaught SyntaxError: Missing initializer in const declaration // error! 초기화 값을 할당하지 않음