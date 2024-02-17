import express from "express";
import multer from "multer";
import path from "path";
import Blog from "../models/blog.js";
import Comment from "../models/comments.js";
const router = express.Router();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve(`./public/uploads/`));
    },
    filename: function (req, file, cb) {
      const name = `${Date.now()}-${file.originalname}`;
      cb(null, name );
    },
  });
  
  const upload = multer({ storage: storage })


router.get("/add-new", (req,res)=>{
    return res.render("addBlog", {
        user: req.user
    })
})

router.get("/:id", async(req,res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdBy");
  const blogComment = await Comment.find({blogId: req.params.id}).populate("createdBy");
 
  
  return res.render('blog',{
    user: req.user,
    blog,
    blogComment
  });
})

router.get("/delete/:id", async(req,res)=>{
  const blog = await Blog.findById(req.params.id);
  await blog.deleteOne();
  console.log("The blog is deleted");
  return res.redirect('/')
})

router.post("/", upload.single("coverImageURL"),  async (req,res)=>{
      const {title, content} = req.body;
      const blog = await Blog.create({
        title,
        content,
        createdBy: req.user._id,
        coverImageURL: `/uploads/${req.file.filename}`,
      })
      

    return res.redirect(`/blog/${blog._id}`);
})


router.post("/comment/:blogId", async(req,res)=>{
   await Comment.create({
    content: req.body.content,
    blogId: req.params.blogId,
    createdBy: req.user._id
   })

   return res.redirect(`/blog/${req.params.blogId}`);
})

export default router;