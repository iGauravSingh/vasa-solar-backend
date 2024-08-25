const router = require("express").Router();

const multer = require("multer");


const { prisma } = require("../db");

const s3 = require("../scripts/aws-config");

// const {} = require("../middlewares/auth")

// aws.config.update({
//     accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     region: process.env.AWS_REGION,
// })

// const s3 = new aws.S3();

// Multer configuration for uploading images to S3
const storage = multer.memoryStorage();
const upload = multer({ storage });
// const upload = multer({
//     storage: multerS3({
//       s3: s3,
//       bucket: process.env.AWS_S3_BUCKET_NAME,
//       acl: 'public-read', // Makes the image publicly accessible
//       metadata: (req, file, cb) => {
//         cb(null, { fieldName: file.fieldname });
//       },
//       key: (req, file, cb) => {
//         const fileName = Date.now().toString() + '-' + file.originalname;
//         cb(null, fileName); // File name for S3
//       },
//     }),
//   });

// auth token latter

router.get("/", async (req, res) => {
  try {
    const allimages = await prisma.gallery.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    res.send(allimages);
  } catch (error) {
    console.log("error connecting database in getting all", error);
    res.status(400).json({ error: "network error" });
  }
});

// Upload image to s3
router.post("/", upload.single("file"), async (req, res) => {
  // console.log("in image upload server route")
  const { buffer } = req.file;
  const { imagename } = req.body;
  try {
    // console.log("printing image name", imagename)
    if (!imagename) res.status(400).json({ error: "invalid data" });

    const params = {
      Bucket: process.env.AWS_S3_BUCKET_NAME,
      Key: imagename,
      Body: buffer,
      ContentType: req.file.mimetype,
    };

    //   console.log('from try in banner upload upper')
    // upload to s3
    const response = await s3.upload(params).promise();

    // console.log('from try in banner upload', response)

    if (response.Location) {
      // Save the image details to PostgreSql using Prisma

      const newImage = await prisma.gallery.create({
        data: {
          imageUrl: response.Location,
          imageName: imagename,
        },
      });

      res.status(200).json({
        message: "Image uploaded successfully!",
      });
    }
  } catch (error) {
    console.error("Error uploading image:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

// add delete route

module.exports = router;
