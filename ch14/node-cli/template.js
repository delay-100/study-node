#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const type = process.argv[2];
const name = process.argv[3];
const directory = process.argv[4] || '.';
// 생성할 html 코드, 백틱(`)은 줄바꿈
const htmlTemplate = ` 
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title>Template</title>
    </head>
    <body>
        <h1>Hello</h1>
        <p>CLI</p>
    </body>
</html>
`;
// 생성할 js 코드
const routerTemplate = `
const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
    try {
        res.send('ok');
    } catch (error) {
        console.error(error);
        next(error);
    }
});

module.exports = router;
`;

const exist = (dir) => { // 폴더 존재 확인 함수
    try {
        fs.accessSync(dir, fs.constants.F_OK | fs.constants.R_OK | fs.constants.W_OK); // fs.accessSync 메서드를 통해 파일이나 폴더가 존재하는지 검사
        return true;
    } catch (e) {
        return false;
    }
};
const mkdirp = (dir) => { // 경로 생성 함수, 리눅스 명령어인 mkdir-p에서 이름을 따온 함수
                          // 예) dir값이 public/html이면 public 폴더를 만들고 html 폴더를 순차적으로 만듦
    
    const dirname = path
        .relative('.', path.normalize(dir)) // '.': 현재 경로, normalize: public\as
        .split(path.sep) // path.sep: 경로의 구분자(windows는 \, posix는 /)으로 구분
        .filter(p => !!p); // 정확도를 높히기 위해 사용, !!는 "", undefined, 0인경우에는 false, 나머지는 true 반환, 간접적 형변환을 위해 사용
        dirname.forEach((d, idx) => {
            const pathBuilder = dirname.slice(0, idx+1).join(path.sep); // 현재 경로와 입력한 경로의 상대적인 위치를 파악한 후 순차적으로 상위 폴더부터 만들어 나감
            console.log(pathBuilder);
            if(!exist(pathBuilder)) {
                fs.mkdirSync(pathBuilder);
            }
        });
};

const makeTemplate = () => { // 템플릿 생성 함수
    mkdirp(directory);
    if (type === 'html') {
        const pathToFile = path.join(directory, `${name}.html`);
        if(exist(pathToFile)) {
            console.error('이미 해당 파일이 존재합니다');
        } else {
            fs.writeFileSync(pathToFile, htmlTemplate);
            console.log(pathToFile, '생성 완료');
        }
    } else if (type === 'express-router') {
        const pathToFile = path.join(directory, `${name}.js`);
        if (exist(pathToFile)) {
            console.error('이미 해당 파일이 존재합니다');
        } else {
            fs.writeFileSync(pathToFile, routerTemplate);
            console.log(pathToFile, '생성 완료');
        }
    } else {
        console.error('html 또는 express-router 둘 중 하나를 입력하세요.');
    }
};

const program = () => {
    if (!type || !name) {
        console.error('사용 방법: cli html|express-router 파일명 [생성 경로]');
    } else {
        makeTemplate();
    }
};

program(); // 프로그램 실행부