// var.js에서 변수를 불러온 뒤, 숫자의 홀짝을 판별

const { odd, even } = require('./var'); // require 안에 불러올 모듈의 경로를 적음, 경로를 잘 지정해주면 다른 폴더에 있는 모듈도 사용 가능
                                         // require함수로 var.js에 있던 값을 불러오는 중, const { odd, even }은 Node 사용을 위한 기본 ES2015 문법에서 다뤘음
                                        // 경로에서 js나 json 같은 확장자는 생략 가능
function checkOddOrEven(num){                                       
    if(num%2){
        return odd;
    }
    return even;
}

module.exports = checkOddOrEven; // 함수를 대입