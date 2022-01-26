// html이 로딩되었을 때 실행됨(기존 데이터)
// 사용자 이름을 눌렀을 때 댓글 로딩
document.querySelectorAll('#user-list tr').forEach((el) => {  // id: #, el: element 반복문
    el.addEventListener('click', function() {
        const id = el.querySelector('td').textContent; // body 값(모든 요소를 포함한)을 하나씩 불러옴 (user.id, user.name, user.age, '기혼' if user.married else '미혼')
        getComment(id); // getComment 함수 호출(아래에 작성되어있음)
    });
});

// 사용자 로딩 함수
async function getUser(){   
    try{
        const res = await axios.get('/users');  // app.js의 '/users'에 의해 routes/users.js의 get이 실행되고 결국, User.findAll()이 가져와짐
        const users = res.data; // .data는 res의 데이터가 존재함
        // console.log(users);
        const tbody = document.querySelector('#user-list tbody'); // document: html의 가장 상위 객체(설명 블로그 참조) 
        tbody.innerHTML = ''; // 일단 tbody에 대한 모든 내용을 초기화함
        users.map(function (user){ // map: 반복문
            const row = document.createElement('tr'); // tr을 생성하면서 빈 row 객체 생성
            // 추가된 데이터에 대한 listener도 필요
            row.addEventListener('click', () => { // 이 row를 클릭하면 실행
                getComment(user.id); // getComment 함수 실행(파라미터로 user의 id를 줌)
                console.log(user.id);
            });
            // row 셀 추가
            let td = document.createElement('td'); // td: 칸 하나하나
            td.textContent = user.id;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.name;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.age;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = user.married ? '기혼' : '미혼';
            row.appendChild(td);

            tbody.appendChild(row);
        });
    } catch(err){
        console.error(err);
    }
}
// 댓글 로딩 함수
async function getComment(id) {
    try{
        const res = await axios.get(`/users/${id}/comments`);  // app.js의 '/users'에 의해 routes/users.js의 '/:id/comments'가 실행
        const comments = res.data;
        const tbody = document.querySelector('#comment-list tbody');
        tbody.innerHTML = '';
        comments.map(function (comment) { // map: 반복문
            // row 셀 추가
            const row = document.createElement('tr');
            let td = document.createElement('td'); // td: 칸 하나하나
            td.textContent = comment.id;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = comment.User.name;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = comment.comment;
            row.appendChild(td);

            // 수정
            const edit = document.createElement('button'); // 수정 버튼
            edit.textContent = '수정';
            edit.addEventListener('click', async () => { // 수정 클릭 시 
                const newComment = prompt('바꿀 내용을 입력하세요');
                if (!newComment){
                    return alert('내용을 반드시 입력하셔야 합니다');
                }
                try {
                    await axios.patch(`/comments/${comment.id}`, { comment: newComment });  // app.js의 '/users'에 의해 routes/comments.js의 '/:id'의 patch가 실행, 새로 작성한 수정 글도 보냄
                    getComment(id);
                } catch(err){
                    console.error(err);
                }
            });

            // 삭제
            const remove = document.createElement('button');  // 삭제 버튼
            remove.textContent = '삭제';
            remove.addEventListener('click', async() => { // 삭제 클릭 시
                try {
                    await axios.delete(`/comments/${comment.id}`); // app.js의 '/users'에 의해 routes/comments.js의 '/:id'의 delete가 실행
                    getComment(id);
                } catch(err){
                    console.error(err);
                }
            });
            // 버튼 추가
            td = document.createElement('td');
            td.appendChild(edit);
            row.appendChild(td);
            td = document.createElement('td');
            td.appendChild(remove);
            row.appendChild(td);
            tbody.appendChild(row);
        });
    } catch(err){
        console.error(err);
    }
}
// 사용자 등록 시
document.getElementById('user-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = e.target.username.value; // e.target:user-form이라는 id를 가진 target, username: id 이름이 username, value: 들어있는 값
    const age = e.target.age.value;
    const married = e.target.married.checked;
    console.log(name);
    if(!name){
        return alert('이름을 입력하세요');
    }
    if(!age){
        return alert('나이를 입력하세요');
    }
    try{
        await axios.post('/users', {name, age, married}); // app.js의 '/users'에 의해 routes/users.js의 post가 실행(post에 name, age, married 값이 전송됨)
        getUser(); // getUser() 함수 실행
    } catch(err){
        console.error(err);
    }
    // 입력한 것 초기화
    e.target.username.value = '';
    e.target.age.value = '';
    e.target.married.checked = false;
});

// 댓글 등록 시
document.getElementById('comment-form').addEventListener('submit', async(e)=>{
    e.preventDefault();
    const id = e.target.userid.value;
    const comment = e.target.comment.value;
    if(!id){
        return alert('아이디를 입력하세요');
    }
    if(!comment){
        return alert('댓글을 입력하세요');
    }
    try{
        await axios.post('/comments', {id, comment}); // app.js의 '/comments'에 의해 routes/comments.js의 post가 실행(post에 id, comment 값이 전송됨)
        getComment(id); // getComment 함수 실행, 파라미터로 userid를 보냄
    } catch(err){
        console.error(err);
    }
    e.target.userid.value='';
    e.target.comment.value='';
});