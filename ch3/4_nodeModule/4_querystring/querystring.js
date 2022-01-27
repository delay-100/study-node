// 두 개의 모듈을 불러옴
const url = require('url'); // url 모듈 불러오기
const querystring = require('querystring'); // querystring 모듈 불러오기

const parsedUrl = url.parse('http://www.gilbut.co.kr/?page=3&limit=10&category=nodejs&category=javascript'); // url모듈로 주소를 파싱
console.log('parse():', parsedUrl);
const query = querystring.parse(parsedUrl.query); // querystring으로 파싱한 주소 중에서 query만 다시 파싱
console.log('querystring.parse():', query);
console.log('querystring.stringify():', querystring.stringify(query));