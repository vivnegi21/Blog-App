"use server"

import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose"
import { revalidatePath } from "next/cache";
export async function updateUser({userId,username,name,bio,image,path}){
    
    
    try {
        await connectToDB();
        await User.findOneAndUpdate(
            {id:userId},
            {
                username : username.toLowerCase(),
                name,
                bio,
                image,
                onboarded:true,
            },
            {upsert:true},   //Update if exist, insert if not exist
        );

        if(path === '/profile/edit'){
            revalidatePath(path);
        }
    } catch (error) {
        throw new Error(`Failed to create/update user: ${error.message}`)
    }
}

export async function fetchUser(userId){
    try {
        connectToDB();
        return await User
        .findOne({id:userId});
        // .populate({
        //     path:'communities',
        //     model: Community,
        // })
    } catch (error) {
        throw new Error(`Failed to fetch user:${error.message}`);
    }
}

export async function fetchUserPosts(userId){
    
    try {
        connectToDB();
        // POPulate COmmunitiyes
        //find all threads with userId==
        const threads = await User.findOne({id:userId})
        .populate({
            path:'threads',
            model:Thread,
            populate:{
                path:'children',
                model:Thread,
                populate:{
                    path:'author',
                    model:User,
                    select: 'name image id'
                }
            }
        });
        return threads;
    } catch (error) {
        throw new Error(`Failed to fetch user posts: ${error.message}`);
    }
}

export async function fetchUsers({
    userId,
    searchString="",
    pageNumber=1,
    pageSize=20,
    sortBy="desc"
}){
    try {
        connectToDB();
        
        const skipAmount = (pageNumber-1)*pageSize;

        const regex = new RegExp(searchString,"i");

        const query = {
            id: {$ne: userId}
        }
        if(searchString.trim()!==''){
            query.$or = [
                {username:{$regex : regex}},
                {name:{$regex : regex}}
            ]
        }
        const sortOptions = {createdAt: sortBy};

        const usersQuery = User.find(query).sort(sortOptions).skip(skipAmount).limit(pageSize);
        const totalUsersCount = await User.countDocuments(query);

        const users  = await usersQuery.exec();

        const isNext = totalUsersCount > skipAmount + users.length;
        return {users,isNext};

    } catch (error) {
        throw new Error(`Error fetching the users: ${error.message}`)
    }
}

export async function getActivity(userId){
    try {
        connectToDB();
        // userId = JSON.parse(userId);
        // Find all threads created by the user
        const userThreads = await Thread.find({ author: userId });
    
        // Collect all the child thread ids (replies) from the 'children' field of each user thread
        const childThreadIds = userThreads.reduce((acc, userThread) => {
          return acc.concat(userThread.children);
        }, []);
    
        // Find and return the child threads (replies) excluding the ones created by the same user
        const replies = await Thread.find({
          _id: { $in: childThreadIds },
          author: { $ne: userId }, // Exclude threads authored by the same user
        }).populate({
          path: "author",
          model: User,
          select: "name image _id",
        });
    
        return replies;
      } catch (error) {
        console.error("Error fetching replies: ", error);
        throw error;
      }
}