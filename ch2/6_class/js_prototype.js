var Human = function(type) {
    this.type = type || 'human';
};

Human.isHuman = function(human){
    return human instanceof Human;
}

Human.prototype.breathe = function(){
    alert('h-a-a-a-m');
};

var Zero = function(type, firstName, lastName) {
    Human.apply(this, arguments); // Human을 상속받는 부분 1
    this.firstName = firstName;
    this.lastName = lastName;
};

Zero.prototype = Object.create(Human.prototype); // // Human을 상속받는 부분 2
Zero.prototype.constructor = Zero; // 상속하는 부분
Zero.prototype.sayName = function(){
    alert(this.firstName + ' '+ this.lastName);
};
var oldZero = new Zero('human', 'Zero', 'Cho');
Human.isHuman(oldZero);
// 출력
// true

