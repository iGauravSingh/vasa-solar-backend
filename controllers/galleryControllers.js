const JWT = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const asyncHandler = require("express-async-handler");
const { validationResult } = require('express-validator');

const { prisma } = require("../db");

// get all images with pagination
const getAllImages = asyncHandler(async (req,res) => {
    try {
        const allimages = await prisma.gallery.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        })
        res.send(allimages)
    } catch (error) {
        console.log('error connecting database in getting all',error)
        res.status(400).json({"error": "network error"})
    }
})

// add images

const addImages = asyncHandler(async (req,res) => {
    // const { buffer } = req.file;

    const { imagename } = req.body
    console.log(imagename)
    res.send("hello")
})

// delete images


//

module.exports = {
    getAllImages, addImages
}