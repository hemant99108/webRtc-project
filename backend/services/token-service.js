const jwt=require('jsonwebtoken');
const accessTokenSecret=process.env.JWT_ACCESS_TOKEN_SECRET;
const refreshTokenSecret=process.env.JWT_REFRESH_TOKEN_SECRET;
const refreshModel=require('../models/refresh-model');
   
 

class TokenService{

    async generateToken(payload){   
        const accessToken=jwt.sign(payload,accessTokenSecret,{expiresIn:'15m'});
        const refreshToken=jwt.sign(payload,refreshTokenSecret,{expiresIn:'7d'});   


        return {accessToken,refreshToken};
    }
    

    async storeRefreshToken(token,userId){
        try {
            await refreshModel.create({
                token,
                userId
            })
        } catch (error) {
            console.log(error.message);
        }
    }


    async verifyAccessToken(token){
        try {
            return  jwt.verify(token,accessTokenSecret);
        } catch (error) {
            console.log(error.message);
            console.log('error verifying access token');
        }
    }

}


module.exports=new TokenService();