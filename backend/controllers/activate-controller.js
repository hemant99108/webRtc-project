
const Jimp = require("jimp").default || require("jimp");
const path = require("path");
const userService = require("../services/user-service");
const UserDto = require("../dtos/user-dto");
const fs = require("fs");
 
class ActivateController {  
    async activate(req, res) {
        // Extracting data from request body
        const { name, avatar } = req.body;
        if (!name || !avatar) {
            return res.status(400).json({ message: "All fields are required" });
        }
    
        // Convert base64 image to buffer
        let buffer;
        try {
            const base64Data = avatar.replace(/^data:image\/[a-z]+;base64,/, "").trim();
            buffer = Buffer.from(base64Data, "base64");
    
            if (!buffer || buffer.length === 0) {
                throw new Error("Invalid image buffer");
            }
        } catch (error) {
            console.error("Error decoding base64 image:", error);
            return res.status(400).json({ message: "Invalid image format" });
        }
        
        // Define image path
        const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
        const storageDir = path.resolve(__dirname, "../storage"); 
        
        // Ensure the storage directory exists
        if (!fs.existsSync(storageDir)) {
            fs.mkdirSync(storageDir, { recursive: true });
        }
        
        // Process image using Jimp
        try {
            
            const jimResp = await Jimp.read(buffer);
            await jimResp.resize(150, Jimp.AUTO);
            await jimResp.writeAsync(path.join(storageDir, imagePath));
        } catch (error) {
            console.error("Error processing image with Jimp:", error);
            return res.status(500).json({ message: "Could not process the image" });
        }
    
        // Fetch and update user details
        const userId = req.user._id;
        try {
            const user = await userService.findUser({ _id: userId });
    
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            user.activated = true;
            user.name = name;
            user.avatar = `/storage/${imagePath}`;
            await user.save();
    
            return res.json({ user: new UserDto(user), auth: true });
        } catch (error) {
            console.error("Database error:", error);
            return res.status(500).json({ message: "Database error" });
        }
    }
}

module.exports = new ActivateController();
