// 각종 편의 기능을 모아둔 모듈

const util = require('util');
const crypto = require('crypto');

/*
 const dontUseMe = util.deprecate((x,y) => {
    console.log(x+y);
},
dontUseMe(1,2));
*/

const randomBytesPromise = util.promisify(crypto.randomBytes);
randomBytesPromise(64)
    .then((buf)=> {
        console.log(buf.toString('base64'));
    })
    .catch((error)=> {
        console.error(error);
    });