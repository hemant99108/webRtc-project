const otpService = require("../services/otp-service");
const hashService = require("../services/hash-service");
const userService = require("../services/user-service");
const tokensService = require("../services/token-service");
const tokenService = require("../services/token-service");
const UserDto = require("../dtos/user-dto");
class AuthController {
    async sendOtp(req, res) {
        const { phone } = req.body;

        if (!phone) {
            res.status(400).json({ message: "Phone is required" });
        }

        const otp = await otpService.generateOtp();

        //hashing is done here

        const ttl = 1000 * 60 * 2; //2 minutes
        const expires = Date.now() + ttl;

        const data = `${phone}.${otp}.${expires}`;

        const hashed = await hashService.hashOtp(data);

        try {
            //send otp to phone\
            // await otpService.sendBySms(phone, otp);
            res.json({
                hash: `${hashed}.${expires}`,
                phone,
                otp,
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Failed to send OTP" });
        }
    }
 
    async verifyOtp(req, res) {
        const { otp, hash, phone } = req.body;
        if (!otp || !hash || !phone) {
            res.status(400).json({ message: "All fields are required!" });
        }

        const [hashedOtp, expires] = hash.split(".");
        if (Date.now() > +expires) {
            res.status(400).json({ message: "OTP expired!" });
        }

        const data = `${phone}.${otp}.${expires}`;
        const isValid = await otpService.verifyOtp(hashedOtp, data);
        if (!isValid) {
            res.status(400).json({ message: "Invalid OTP" });
        }

        let user;
        try {
            user = await userService.findUser({ phone });
            if (!user) {
                user = await userService.createUser({ phone });
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({ message: "Db error" });
        }

        const { accessToken, refreshToken } = await tokenService.generateToken({
            _id: user._id,
            activated: false,
        });

        //before setting the token to cookie store it to db with id so that after logout set it back to null

        await tokenService.storeRefreshToken(refreshToken, user._id);

        res.cookie("refreshToken", refreshToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie("accessToken", accessToken, {
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        //transforming the users data to only we require
        const userDto = new UserDto(user);

        res.json({ auth: true, user: userDto });
    }

    async refresh(req, res) {
        //get token from cookie and check its valid or not from db
        //then generate new tokens and put to cookie

        const { refreshToken: refreshTokenFromCookie } = req.cookies;
        let userData;
        try {
            userData = await tokenService.verifyRefreshToken(
                refreshTokenFromCookie
            );
        } catch (error) {
            return res.status(401).json({ message: "invalid refresh token" });
        }

        //check if token in db\
        try {
            const token = await tokenService.findRefreshToken(
                userData._id,
                refreshTokenFromCookie
            );

            if (!token) {
                return res
                    .status(401)
                    .json({ message: "  refresh token not found in db" });
            }
        } catch (error) {
            return res.status(500).json({ message: " internal error" });
        }

        //check if the user is a valid user or not
        const user = await userService.findUser({ _id: userData._id });
        if (!user) {
            return res.status(404).json({ message: " user not found" });
        }

        //generate new tokens
        const { refreshToken, accessToken } = await tokenService.generateToken({
            _id: userData._id,
        });

        //update the refresh token with the new one to maintain the existing login user information for consistency

        try {
            await tokenService.updateRefreshToken(userData._id, refreshToken);
        } catch (error) {
            return  res.status(500).json({ message: " internal error" });
        }

        //put this into new cookie 
        res.cookie('refreshToken',refreshToken,{
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        res.cookie('accessToken',accessToken,{
            maxAge: 1000 * 60 * 60 * 24 * 30,
            httpOnly: true,
        });

        //make the user the response '
        const userDto=new UserDto(user);

        res.json({user:userDto,auth:true}); 
    } 

    async logout(req, res) {
        //delete refresh token from db 
        const { refreshToken } = req.cookies;
        await tokenService.removeToken(refreshToken);
        //delete the cookie also  

        res.clearCookie('refreshToken');
        res.clearCookie('accessToken'); 

        res.json({user:null,auth:false});

    }
}

module.exports = new AuthController();
