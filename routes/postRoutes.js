const express = require('express')
const router = express.Router()

const multer = require("multer");


const { prisma } = require("../db");

const s3 = require("../scripts/aws-config");

const postCOntroller = require('../controllers/postController')
const { authenticateToken } = require('../middlewares/auth')



const storage = multer.memoryStorage();
const upload = multer({ storage });

//


router.get('/', postCOntroller.getAllPosts)

//

router.post('/', authenticateToken,upload.single("file"), async (req,res) => {
    //console.log('in post controller create post')

    const { buffer } = req.file;

    const {heading, location, completionDate, description, imagename} = req.body;

    if(!heading || !location || !completionDate || !description ){
        return res.status(400).json({"error": "Invalid data"})
    }

    const parseDate = new Date(completionDate)

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: imagename,
        Body: buffer,
        ContentType: req.file.mimetype,
      };
    
    try {

        const response = await s3.upload(params).promise();

        if (response.Location) {

        const newevent = await prisma.post.create({
            data: {
                heading,
                location,
                completionDate: parseDate,
                description,
                imageUrl: response.Location,
            }
        })
        res.json({message: "ok created"})
    }
    } catch (error) {
        console.log('error connecting database in creating',error)
    }
}) 

//

router.delete('/:id', async (req,res) => {
    try {
      const { id } = req.params;
      await prisma.post.delete({
        where: {
          id: parseInt(id),
        },
      })
      res.status(200).json({ success: true, id})
    } catch (error) {
      console.log("error communicating database");
    }
  })

module.exports = router