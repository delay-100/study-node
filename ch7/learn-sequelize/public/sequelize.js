// 사용자 이름을 눌렀을 때 댓글 로딩
document.querySelectorAll('#user-list tr').forEach((el) => {  // id: #, el: element 반복문
    el.addEventListener('click', function() {
        const id = el.querySelector('td').textContent; // body 값(모든 요소를 포함한)을 하나씩 불러옴 (user.id, user.name, user.age, '기혼' if user.married else '미혼')
                                                        // textContent VS innerText(사람이 읽을 수 있는 텍스트만 불러옴)
        getComment(id); // getComment 함수 호출(아래에 작성되어있음)
    });
});

// 사용자 로딩 함수
async function getUser(){   
    try{
        const res = await axios.get('/users');  // app.js의 '/users'에 의해 결국, User.findAll()이 가져와짐
        const users = res.data; // res의 데이터부분을 가져옴
        console.log(users);
        const tbody = document.querySelector('#user-list tbody'); 
        tbody.innerHTML = '';
        users.map(function (user){
            const row = document.createElement('tr');
            row.addEventListener('click', () => {
                getComment(user.id);
            });
            // 로우 셀 추가
            let td = document.createElement('td');
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
        const res = await axios.get(`/users/${id}/comments`);
        const comments = res.data;
        const tbody = document.querySelector('#comment-list tbody');
        tbody.innderHTML = '';
        comments.map(function (comment) {
            // 로우 셀 추가
            const row = document.createElement('tr');
            let td = document.createElement('td');
            td.textContent = comment.id;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = comment.User.name;
            row.appendChild(td);
            td = document.createElement('td');
            td.textContent = comment.comment;
            row.appendChild(td);
            // 수정
            const edit = document.createElement('button');
            edit.textContent = '수정';
            edit.addEventListener('click', async () => { // 수정 클릭 시 
                const newComment = prompt('바꿀 내용을 입력하세요');
                if (!newComment){
                    return alert('내용을 반드시 입력하셔야 합니다');
                }
                try {
                    await axios.patch(`/comments/${comment.id}`, { comment: newComment });
                    getComment(id);
                } catch(err){
                    console.error(err);
                }
            });
            // 삭제
            const remove = document.createElement('button');
            remove.textContent = '삭제';
            remove.addEventListener('click', async() => { // 삭제 클릭 시
                try {
                    await axios.delete(`/comments/${comment.id}`);
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
    const name = e.target.username.value;
    const age = e.target.age.value;
    const married = e.target.married.checked;
    if(!name){
        return alert('이름을 입력하세요');
    }
    if(!age){
        return alert('나이를 입력하세요');
    }
    try{
        await axios.post('/users', {name, age, married});
        getUser();
    } catch(err){
        console.error(err);
    }
    e.target.username.value = '';
    e.target.age.value = '';
    e.target.married.checked = false;
});
// 댓글 등록 시
document.getElemenetById('comment-form').addEventListener('submit', async(e)=>{
    e.preventDefault();
    const id = e.target.userid.value;
    const comment = e.target.comment.value;
    if(!id){
        return alert('아이디를 입력하세요');
    }
    if(!comment){
        return alert('댓글을 입력하세요');
    }
    try {
        await axios.post('/comments', { id, comment });
        getComment(id);
    } catch(err){
        console.error(err);
    }
    e.target.userid.value = '';
    e.target.comment.value = '';
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
        await axios.post('/comments', {id, comment});
        getComment(id);
    } catch(err){
        console.error(err);
    }
    e.target.userid.value='';
    e.target.comment.value='';
})