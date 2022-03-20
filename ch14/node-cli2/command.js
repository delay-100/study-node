#!/usr/bin/env node
const { program } = require('commander'); // commander 패키지로부터 program 객체를 불러옴

// program 객체에는 다양한 메서드가 존재
program
    .version('0.0.1', '-v, --version')
    .name('cli');

program
    .command('template <type>')
    .usage('<type> --filename [filename] --path [path]')
    .description('템플릿을 생성합니다.')
    .alias('tmpl')
    .option('-f, --filename [filename]', '파일명을 입력하세요.', 'index')
    .option('-d, --directory [path]', '생성 경로를 입력하세요', '.')
    .action((type, options) => {
        console.log(type, options.filename, options.directory);
    });

program
    .command('*', { noHelp: true})
    .action(() => {
        console.log('해당 명령어를 찾을 수 없습니다.');
    });

program
    .parse(process.agrv);