const express = require("express");
const app = express();
const router = express.Router();
const cloudinary = require('cloudinary').v2;

const Post = require("../Model/postModel");


cloudinary.config({
    secure: true
});

//   console.log(cloudinary.config());

router.post("/createPost", (req, res) => {

    // console.log(req.body);
    const file = req.files.image;
    console.log(file);

    let imagePath = file.tempFilePath

    const uploadImage = async (imagePath) => {
        const options = {
            use_filename: true,
            unique_filename: false,
            overwrite: true,
        };
        try {
            // Upload the image
            const result = await cloudinary.uploader.upload(imagePath, options);
            console.log(result.url);
            const post = new Post({
                name: req.body.name,
                postImage: result.url,
                Location: req.body.Location,
                description: req.body.description,
                date: new Date().toLocaleString(),
                likes: req.body.likes
            });
            post.save().then(response => {
                res.status(201).json({
                    status: "success",
                    message: "post created",
                    data: response
                });
            })
                .catch(err => {
                    res.status(500).json({
                        status: "failed",
                        errorDesc: "Internal server error",
                        error: err
                    });
                })
        } catch (error) {
            console.error(error);
        }
    };

    uploadImage(imagePath);
})
router.get("/getPost", (req, res) => {

    const search = req.query.search;
    const ID = req.query.id;
    const filter = { name: { '$regex': `${search}`, '$options': 'i' } };

    Post.find({}).then(response => {
        res.status(200).json({
            status: "success",
            message: "successful fetched data",
            data: response
        });
    })
        .catch(err => {
            res.status(500).json({
                status: "failed",
                errorDesc: "Internal server error",
                error: err
            })
        })
})

// always add updated property in updatOne()methode
router.put("/updatePost/:id", (req, res) => {
    const ID = req.params.id;
    console.log(ID);
    Post.updateOne({ _id: ID }, req.body).then(response => {
        res.status(200).json({
            status: "success",
            message: " data updated successful",
            data: response
        });
    })
        .catch(err => {
            res.status(500).json({
                status: "failed",
                errorDesc: "Internal server error",
                error: err
            })
        })

})
router.delete("/deletePost/:id", (req, res) => {
    const ID = req.params.id;
    Post.deleteOne({ _id: ID }).then(response => {
        res.status(200).json({
            status: "success",
            message: "deleted data successful",
            data: response
        });
    })
        .catch(err => {
            res.status(500).json({
                status: "failed",
                errorDesc: "failed to delete data",
                error: err
            })
        })
})

module.exports = router;