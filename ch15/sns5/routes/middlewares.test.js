// test('1+1은 2입니다.', () => {
//     expect(1+1).toEqual(3);
// });

const { isLoggedIn, isNotLoggedIn } = require('./middlewares'); 

describe('isLoggedIn', () => { // describe 함수: 테스트를 그룹화해줌, 첫 번째 인수(isLoggedIn): 그룹에 대한 설명, 두 번째 인수(()=>{}): 그룹에 대한 내용
    const res = {
        status: jest.fn(() => res), // jest.fn(() => 반환값) 메서드: 함수를 모킹할 때 사용
        send: jest.fn(),
    };
    const next = jest.fn();

    test('로그인되어 있으면 isLoggedIn이 next를 호출해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => true),
        };
        isLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });

    test('로그인되어 있지 않으면 isLoggedIn이 에러를 응답해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => false),
        };
        isLoggedIn(req, res, next);
        expect(res.status).toBeCalledWith(403);
        expect(res.send).toBeCalledWith('로그인 필요');
    });
});

describe('isNotLoggedIn', () => {
    const res = {
        redirect: jest.fn(),
    };
    const next = jest.fn();

    test('로그인되어 있으면 isNotLoggedIn이 에러를 응답해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => true ),
        };
        isNotLoggedIn(req, res, next);
        const message = encodeURIComponent('로그인한 상태입니다.');
        expect(res.redirect).toBeCalledWith(`/?error=${message}`);
    });

    test('로그인이되어 있지 않으면 isNotLoggedIn이 next를 호출해야 함', () => {
        const req = {
            isAuthenticated: jest.fn(() => false ),
        };
        isNotLoggedIn(req, res, next);
        expect(next).toBeCalledTimes(1);
    });
});