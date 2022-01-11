// this 바인드 방식(function함수 사용)
var relationship1 = {
    name: 'zero',
    friends: ['nero', 'hero', 'xero'],
    logFriends: function() {
        var that = this; // relationship1을 가리키는 this를 that에 저장 -> 이 문장이 없으면 function이 현재 this를 인식하지 못함.
        this.friends.forEach(function (friend){ // 지금은 forEach는 반복문이라고 이해하면 됨
            console.log(that.name, friend);
        });
    },
};
relationship1.logFriends();

// this 바인드 방식(화살표 함수 사용) 
const relationship2 = {
    name: 'zero',
    friends: ['nero', 'hero', 'xero'],
    logFriends(){    
        this.friends.forEach(friend=> { // 화살표 함수로 변경
            console.log(this.name, friend);
        });
    },
};
relationship2.logFriends();
// 출력
// zero nero
// zero hero
// zero xero
// zero nero
// zero hero
// zero xero