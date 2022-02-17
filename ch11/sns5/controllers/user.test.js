// user 모델 모킹
jest.mock('../models/user'); // jest.mock 메서드: 모킹할 모듈의 경로를 인수로 넣고,
const User = require('../models/user'); // 해당 모듈을 불러옴

// addFollowing 컨트롤러 테스트
const { addFollowing } = require('./user'); 


describe('addFollowing', () => {
    const req = {
        user: { id: 1},
        params: { id: 2},
    };
    const res = {
        status: jest.fn(() => res),
        send: jest.fn(),
    };
    const next = jest.fn();

    test('사용자를 찾아 팔로잉을 추가하고 success를 응답해야 함', async () => {
        User.findOne.mockReturnValue(Promise.resolve({ // jest.mock에서 모킹할 메서드(User.findOne)에 mockReturnValue 메서드: 가짜 반환값 지정 가능
        addFollowing(id) { // User.findOne이  { addFollowing() } 객체를 반환하도록 함 -> 사용자를 찾아 팔로잉을 추가하는 상황을 테스트하기 위함
                return Promise.resolve(true);
            }
        }));
        await addFollowing(req, res, next); //  프로미스를 반환해야 await user.addFollowing 메서드 호출 가능
        expect(res.send).toBeCalledWith('success');
    });

    test('사용자를 못 찾으면 res.status(404).send(no user)를 호출함', async () => {
        User.findOne.mockReturnValue(null); // 일부러 null을 반환해 사용자를 찾지 못한 상황을 테스트
        await addFollowing(req, res, next);
        expect(res.status).toBeCalledWith(404);
        expect(res.send).toBeCalledWith('no user');
    });
    
    test('DB에서 에러가 발생하면 next(error) 호출함', async () => {
        // const error = '테스트용 에러';
        const error = '사용자 못 찾음';
        User.findOne.mockReturnValue(Promise.reject(error)); // Promise.reject로 에러가 발생하도록 함, db에 연결에러가 발생한 상황을 모킹한 것
        await addFollowing(req, res, next);
        expect(next).toBeCalledWith(error);
    });
});