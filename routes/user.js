import express from 'express'
import User from '../models/user.js';

const router = express.Router();



router.get('/signin', (req,res)=>{
    res.render("signin");
})

router.post('/signin', async (req,res)=>{
    const {email, password} = req.body;
    try {
        const token = await User.matchPasswordAndGenerateToken(email, password);
        return res.cookie("token", token).redirect('/');
    } catch (error) {
        return res.render("signin", {
            error: "Incorrect Email or Password",
        });
        
    }
   

})

router.get('/signup', (req,res)=>{
    res.render("signup");
})

router.post("/signup",async (req,res)=>{
    const {fullName, email, password} = req.body;

    await User.create({
        fullName,
        email,
        password
    });

    res.redirect('/');
})

router.get('/logout', (req,res)=>{
    return res.clearCookie("token").redirect('/');
}
)


export default router; 