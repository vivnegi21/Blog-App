import { fetchUserPosts } from "@/lib/actions/users.action"
import { redirect } from "next/navigation";
import ThreadCard from "../cards/threadcard";

const ThreadsTab = async ({currentUserId, accountId, accountType}) => {
    
    // TODO: Fetch profile Threads

    let result = await fetchUserPosts(accountId);
    if(!result) redirect('/');

    return (
    <section className="mt-9 flex flex-col gap-10">
        {result.threads.map((thread)=>(
            <ThreadCard
                key={thread._id}
                id={thread._id}
                currentUserId={currentUserId}
                parentId={thread.parentId}
                content={thread.text}
                author={
                    accountType==='User'?
                    {name:result.name,image:result.image,id:result.id}:
                    {name:thread.author.name,image:thread.author.image,id:thread.author.id}
                }  //update later
                community={thread.community}    //todo
                createdAt={thread.createdAt}
                comments={thread.children}
            />
        ))

        }    
    </section>
  )
}

export default ThreadsTab