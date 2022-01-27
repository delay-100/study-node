// 입력
const sayNode = function() {
    console.log('Node');
};
const es = 'ES';
const newObject = {
    sayJS(){ // 함수 연결 시 :, function을 적지 않아도 됨
        console.log('JS'); 
    },
    sayNode, // 속성명과 변수명이 동일한 경우에는 한 번만 써도 됨
    [es + 6]: 'Fantastic', // 속성명을 객체 안에서 동적으로 설정 가능
};
newObject.sayNode();
newObject.sayJS();
console.log(newObject.ES6);
// 출력
// Node
// JS
// Fantastic