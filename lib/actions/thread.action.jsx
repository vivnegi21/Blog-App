"use server"

import { connectToDB } from "../mongoose";
import Thread from '../models/thread.model';
import  User from "../models/user.model";
import { revalidatePath } from "next/cache";

export async function createThread({text,author,communityID,path}){
    try {
        connectToDB();
        const createdThread = await Thread.create({
            text,
            author,
            communityId:null,
            path:path,
        });
        console.log(createdThread);

        //Update User Model
        await User.findByIdAndUpdate(author,{
            $push:{threads:createdThread._id },
        });

        revalidatePath(path)
    } catch (error) {
        throw new Error(`Error in createThread ${error.message}`);
    }
}

export async function fetchPosts(pageNumber=1,pageSize=20){
    connectToDB();
    //calc the number of post to skip
    const skipAmount = (pageNumber-1)*pageSize;
    //fetch post that have no parents(top-level post)
    const postQuery = Thread.find({parentID:{$in: [null,undefined]}})
    .sort({createdAt:'desc'})
    .skip(skipAmount).
    limit(pageSize)
    .populate({path:'author',model: User})
    .populate({
        path:'children',
        populate:{
            path:'author',
            model:User,
            select:'_id name parentId image'
        }
    });
    const totalPostsCount = await Thread.countDocuments({parentID:{$in: [null,undefined]}});
    const posts = await postQuery.exec();
    const isNext = totalPostsCount > skipAmount+posts.length;
    return {posts,isNext}; 
}

export async function fetchThreadByID(id){
    connectToDB();
    try {
        // TODO: Populate COmmunity

        const thread = await Thread.findById(id).populate({
            path:'author',
            model: User,
            select: "_id id name image"
        })
        .populate({
            path:'children',
            populate:[
                {
                    path:'author',
                    model: User,
                    select: '_idid name image'
                },{
                    path:'children',
                    model: Thread,
                    populate:{
                        path: 'author',
                        model:User,
                        select:'_id id name image'
                    }
                }
            ]
        }).exec();
        return thread;
    } catch (error) {
        throw new Error(`Error fetching Thread : ${error.message}`);
    }
}

export async function addCommenttoThread(threadId, commentText, userId, path){
    connectToDB();
    try {
        //adding comment
        //find original thread by its id
        const originalThread = await Thread.findById(threadId);
        if(!originalThread){
            throw new Error("Original Thread not found");
        }

        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        });
        //save new thread 
        const savedCommentThread = await commentThread.save();

        //update original thread to include new thread
        originalThread.children.push(savedCommentThread._id);

        //save original thread 
        await originalThread.save();

        revalidatePath(path);
    } catch (error) {
        throw new Error(`Error adding comment to thread: ${error.message}`);
    }

}