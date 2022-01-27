var candyMachine = {
    status: {
        name: 'node',
        count: 5,
    },
    getCandy: function(){
        this.status.count--;
        return this.status.count;
    },
};

// 직접 변수에 할당해야 함
var getCandy = candyMachine.getCandy; 
var count = candyMachine.status.count;