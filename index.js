import express from "express";
import path from "path";
import userRouter from "./routes/user.js"
import blogRouter from "./routes/blog.js"
import { config } from "dotenv";
config({
    path: "./data/config.env"
});
import { connectDB } from "./data/database.js";
import cookieParser from "cookie-parser";
import { checkForAuthenticationCookie } from "./middleware/authentication.js";
import Blog from "./models/blog.js";

const app = express();
connectDB();
const PORT = process.env.PORT || 8000;
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));
app.use('/user', userRouter);
app.use('/blog', blogRouter);
app.get('/', async(req,res)=>{
    const allBlogs = await Blog.find({});
    res.render("home",{
        user: req.user,
        blogs: allBlogs
    });
})

app.listen(PORT, ()=>{
    console.log(`server is running on port: ${PORT}`);
})