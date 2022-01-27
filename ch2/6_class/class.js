class Human {
    constructor(type = 'human'){ // 생성자
        this.type = type;
    }

    static isHuamn(human){// human인지 확인하는 메소드
        return human instanceof Human;
    }

    breathe(){
        alert('h-a-a-a-m');
    }
}

class Zero extends Human{
    constructor(type, firstName, lastName){
        super(type);
        this.firstName = firstName;
        this.lastName = lastName;
    }

    sayName(){
        super.breathe();
        alert(`${this.firstName} ${this.lastName}`);
    }
}

const newZero = new Zero('human', 'Zero', 'Cho');
Human.isHuamn(newZero); // true

