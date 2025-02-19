const crypto=require('crypto');


class HashService{

    async hashOtp(otp){
        const hash=await  crypto.createHmac('sha256',process.env.HASH_SECRET).update(otp.toString()).digest('hex');
        

        return hash;
    }

}


module.exports=new HashService();

