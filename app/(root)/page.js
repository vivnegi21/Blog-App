"user client"
import { fetchPosts } from "@/lib/actions/thread.action";
import { currentUser } from "@clerk/nextjs";
import ThreadCard from "../../components/cards/threadcard";

export default async function Home() {
  const user = await currentUser();
  
  const result = await fetchPosts(1,30);
  console.log(result.posts.length);

  return (
    <>
      <h1 className='head-text text-left'>Home Page </h1>
      <section className="mt-9 flex flex-col gap-10">
        {result.posts.length === 0 ? (
            <p className="no-result">No Posts Found</p>
          ) : (
            <>
              {result.posts.map((post) => (
                 <ThreadCard
                  key = {post._id}
                  id = {post._id}
                  currentUserId = {user?.id}
                  parentID = {post.parentID}
                  content = {post.text}
                  author = {post.author}
                  community = {post.community}
                  createdAt = {post.createdAt}
                  comments = {post.comments}
                 />
              ))}
            </>
          )
        }
      </section>
    </> 
    )
  }