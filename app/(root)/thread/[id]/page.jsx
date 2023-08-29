import ThreadCard from '@/components/cards/threadcard'
import Comment from '@/components/forms/Comment';
import { fetchThreadByID } from '@/lib/actions/thread.action';
import { fetchUser } from '@/lib/actions/users.action';
import { currentUser } from '@clerk/nextjs';
import { X } from 'lucide-react';
import { redirect } from 'next/navigation';
import React from 'react'

const Page = async ({params}) => {
    if(!params) return null;
    
    const user =await currentUser();
    if(!user) return null;

    const userInfo =await fetchUser(user.id);
    if(!userInfo?.onboarded) redirect('/onboarding');

    const thread = await fetchThreadByID(params.id);

    return(
        <section className='relative'>
            <div>
                <ThreadCard
                    key = {thread._id}
                    id = {thread._id}
                    currentUserId = {user.id}
                    parentID = {thread.parentID}
                    content = {thread.text}
                    author = {thread.author}
                    community = {thread.community}
                    createdAt = {thread.createdAt}
                    comments = {thread.comments}
                />
            </div>
            <div className='mt-7'>
                
                <Comment
                threadId={params.id}
                currentUserImg={user.imageUrl}
                currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>
            <div className='mt-10'>
                {thread.children.map((childItem) => (
                <ThreadCard
                    key={childItem._id}
                    id={childItem._id}
                    currentUserId={user.id}
                    parentId={childItem.parentId}
                    content={childItem.text}
                    author={childItem.author}
                    community={childItem.community}
                    createdAt={childItem.createdAt}
                    comments={childItem.children}
                    isComment
                />
                ))}
            </div>
        </section>
    )
}

export default Page