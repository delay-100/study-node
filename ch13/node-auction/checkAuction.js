const { Op } = require('Sequelize');

const { Good, Auction, User, sequelize } = require('./models');

module.exports = async () => {
    try {
        // 낙찰자가 없으면서 생성된 지 24시간이 지난 경매를 찾아 낙찰자를 정함
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1); 
        const targets = await Good.findAll({
            where: {
                SolidId: null,
                createdAt: { [Op.lte]: yesterday },
            },
        });
        targets.forEach(async (target) => {
            const success= await Auction.findOne({
                where: { GoodId: target.id}, 
                order: [['bid', 'DESC']],
            });
            await Good.update({ SoldId: success.UserId }, { where: { id: target.id }});
            await User.update({
                money: sequelize.literal(`money - ${success.bid}`),
            }, {
                where: { id: success.UserId },
            });
        });
    } catch (error) {
        console.error(error);
    }
};