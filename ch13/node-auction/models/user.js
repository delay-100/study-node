// 사용자 모델
const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            email: { // 이메일
                type: Sequelize.STRING(40),
                allowNull: false,
                unique: true,
            },
            nick: { // 닉네임
                type: Sequelize.STRING(15),
                allowNull: false,
            },
            password: { // 비밀번호
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            money: { // 보유 자금
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'User',
            tableName: 'users',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    } 
    
    static associate(db) {
        db.User.hasMany(db.Auction);
    }
}