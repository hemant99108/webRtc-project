const jwt = require("jsonwebtoken");
const accessTokenSecret = process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.JWT_REFRESH_TOKEN_SECRET;
const refreshModel = require("../models/refresh-model");

class TokenService {
    async generateToken(payload) {
        const accessToken = jwt.sign(payload, accessTokenSecret, {
            expiresIn: "1m",
        });
        const refreshToken = jwt.sign(payload, refreshTokenSecret, {
            expiresIn: "7d",
        });

        return { accessToken, refreshToken };
    }

    async storeRefreshToken(token, userId) {
        try {
            await refreshModel.create({
                token,
                userId,
            });
        } catch (error) {
            console.log(error.message);
        }
    }

    async verifyAccessToken(token) {
        return jwt.verify(token, accessTokenSecret);
    }

    async verifyRefreshToken(refreshToken) {
        return jwt.verify(refreshToken, refreshTokenSecret);
    }

    async findRefreshToken(userId, refreshToken) {
        return await refreshModel.findOne({
            userId: userId,
            token: refreshToken,
        });
    }

    async updateRefreshToken(userId, refreshtoken) {
        return await refreshModel.updateOne(
            { userId: userId },
            { token: refreshtoken }
        );
    }

    async removeToken(refreshToken){
        return await refreshModel.deleteOne({token:refreshToken}); 
    }
}

module.exports = new TokenService();
