async function findAndSaveUser(Users){
    // 생략
}
findAndSaveUser().then(()=> { /*생략*/}); // findAndSaveUser()은 프로미스(Promise)타입을 반환, 따라서 then()을 사용할 수 있음

// 또는

async function other(){
    const result = await findAndSaveUser();
}