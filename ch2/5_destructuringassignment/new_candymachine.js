const candyMachine = {
    status: {
        name: 'node',
        count: 5,
    },
    getCandy(){
        this.status.count--;
        return this.status.count;
    },
};

// candyMachine 안의 속성이 찾아져 getCandy와 count 변수가 초기화 됨
const { getCandy, status: { count }} = candyMachine;