async function findAndSaveUser(Users){ 
    let user = await Users.findOne({}); // await Users.findOne({})이 resolve될 때까지 기다린 다음에 user 변수를 초기화 함
    user.name = 'zero';
    user = await user.save();
    user = await Users.findOne({gender:'m'});
    // 생략
}