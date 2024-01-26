import mongoose from "mongoose";
import {createHmac, randomBytes} from 'crypto';
import { createTokenForUser } from "../services/auth.js";



const userSchema = mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    salt: {
        type: String,
       
    },
    password: {
        type: String,
        required: true
    },
    profileImageUrl:{
        type: String,
        default: "/images/default.png"
    },  
    role: {
        type: String,
        enum: ["USER", "ADMIN"],
        default: "USER",
    }
    

}, {timeStamp: true});

userSchema.pre("save", function (next) {
    const user = this;

    if(!user.isModified("password") ) return;

    const salt = "hdksdhdshdjs";
    const hashedPass = createHmac('sha256', salt)
    .update(user.password)
    .digest("hex");

    this.salt = salt;
    this.password = hashedPass;

    next();
});

userSchema.static("matchPasswordAndGenerateToken", async function (email, password) {
    const user = await this.findOne({email});
    if(!user) throw new Error('User not found');

    const salt = user.salt;
    const userPass = user.password;

    const userProvidedHash = createHmac('sha256', salt)
    .update(password)
    .digest("hex");

    if(userPass !== userProvidedHash) throw new Error('Incorrect Password');

    const token = createTokenForUser(user);
   
    return token;
})

const User = mongoose.model("user", userSchema);

export default User;