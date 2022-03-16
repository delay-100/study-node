// 상품 모델
const Sequelize = require('sequelize');

module.exports = class Good extends Sequelize.Model {
    static init(sequelize) {
        return super.init({
            name: { // 상품명
                type: Sequelize.STRING(40),
                allowNull: false,
            },
            img: { // 상품 사진
                type: Sequelize.STRING(200),
                allowNull: true,
            },
            price: { // 시작 가격
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 0,
            },
        }, {
            sequelize,
            timestamps: true,
            paranoid: true,
            modelName: 'Good',
            tableName: 'goods',
            charset: 'utf8',
            collate: 'utf8_general_ci',
        });
    }

    static associate(db) {
        db.Good.belongsTo(db.User, { as: 'Owner' });
        db.Good.belongsTo(db.User, { as: 'Sold' });
        db.Good.hasMany(db.Auction);
    }
};