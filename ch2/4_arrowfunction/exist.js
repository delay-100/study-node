// add1~add4는 같은 기능을 하는 함수
function add1(x, y){
    return x + y;
}

const add2 = (x, y) =>{
    return x + y; // 함수 내에 return 문만 존재하는 경우 add3, add4처럼 생략 가능 
};

const add3 = (x, y) => x + y;

const add4 = (x, y) => (x + y);

// not1~not2은 같은 기능을 하는 함수
function not1(x) {
    return !x;
}

const not2 = x => !x;