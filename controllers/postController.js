const JWT = require("jsonwebtoken");
const bcrypt = require('bcrypt');
const asyncHandler = require("express-async-handler");
const { validationResult } = require('express-validator');

const { prisma } = require("../db");

//// get all rposts
const getAllPosts = asyncHandler(async (req,res)=> {
    try {
        const allpost = await prisma.post.findMany({
            orderBy: {
                createdAt: 'desc'
              }
        })
    res.send(allpost)
    } catch (error) {
        console.log('error connecting database in getting all',error)
        res.status(400).json({"error": "network error"})
    }
})


//// create post
const createPost = asyncHandler(async (req,res)=>{
    //console.log('in post controller create post')
    const {heading, location, completionDate, description, image} = req.body;
    
    try {
        const newevent = await prisma.post.create({
            data: {
                heading,
                location,
                completionDate,
                imageUrl,
            }
        })
        res.json({message: "ok created"})
    } catch (error) {
        console.log('error connecting database in creating',error)
    }
})

//// delete post
const deletePost = asyncHandler(async (req,res)=> {
    const id = parseInt(req.params.id, 10)
    //console.log('in event controller delete event here is req.body', id)
    
    try {
        const deletePost = await prisma.Post.delete({
            where: {
                id: id
            }
        })
        res.send({message: 'deleted'})
    } catch (error) {
        console.log('error connecting database in deleting',error)
    }
})

module.exports = {
    getAllPosts, createPost, deletePost
}