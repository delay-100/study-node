const Sequelize = require('sequelize');

module.exports = class Domain extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            host: { // 인터넷 주소(host)
                type: Sequelize.STRING(80),
                allowNull: false,
            },
            type: { // 도메인 종류(type)
                type: Sequelize.ENUM('free', 'premium'), // ENUM: 넣을 수 있는 값을 제한하는 데이터 형식, [무료: free, 프리미엄: proemium] 중 하나의 종류만 선택 가능-> 어기면 에러
                allowNull: false,
            },
            clientSecret: { // 클라이언트 비밀 키(clientSecret) - 다른 개발자들이 sns의 API를 사용할 때 필요한 비밀 키
                type: Sequelize.UUID, // UUID: 충돌 가능성이 매우 적은 랜덤한 문자열
                allowNull: false,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Domain',
            tableName: 'domains',
        });
    }
    static associate(db) {
        db.Domain.belongsTo(db.User); // User(1): Domain(N)으로, 일대다 관계
    }
}