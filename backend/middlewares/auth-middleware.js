const tokenService = require("../services/token-service");

module.exports = async function (req, res, next) {
    try {
        const { accessToken } = req.cookies;
        if (!accessToken) {
            throw new Error("No token found");
        }

        const userData=await tokenService.verifyAccessToken(accessToken);
        if(!userData){
            throw new Error("no user found with access token");
        }

        req.user = userData;
        next();
      
        
    } catch (error) {
        console.log(error);
        res.status(401).json({ message: "Invalid access token" });
    }
};
