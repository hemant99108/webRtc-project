const User=require('../models/user-model');

class UserService{
    async findUser(filter){
        const user=await User.findOne(filter);
        return user;
    }


    async createUser(userData){
        const user=new User(userData);
        await user.save();
        return user;
    }
}











module.exports=new UserService();