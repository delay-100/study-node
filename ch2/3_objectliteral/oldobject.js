// 입력
var sayNode = function() {
    console.log('Node');
};
var es = 'ES';
var oldObject = {
    sayJS: function() {
        console.log('JS');
  },
  sayNode: sayNode, // (sayNode(속성명): sayNode(변수명))
};
oldObject[es + 6] = 'Fantastic' // ES6이라는 속성 명 생성 시 객체 리터럴 바깥에서 해야 함 
oldObject.sayNode();
oldObject.sayJS();
console.log(oldObject.ES6);
// 출력
// Node
// JS
// Fantastic