"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {zodResolver} from "@hookform/resolvers/zod";
import { Input } from "../ui/input"
import { updateUser } from "@/lib/actions/users.action"
import { usePathname, useRouter } from 'next/navigation';
import Image from 'next/image';
import { commentValidation } from "@/lib/validation/thread";
import { currentUser } from "@clerk/nextjs";
import { addCommenttoThread } from "@/lib/actions/thread.action";
// import { createThread } from "@/lib/actions/thread.action";


const Comment = ({threadId,currentUserImg,currentUserId}) => {
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(commentValidation),
    defaultValues: {
      thread: "",
    }
  });

  async function onSubmit(values){
    console.log("Button");
    await addCommenttoThread(threadId,values.thread,JSON.parse(currentUserId),pathname);

    form.reset();
  };
  return (
    <Form {...form}>
        <form
            className='comment-form'
            onSubmit={form.handleSubmit(onSubmit)}
        >
            <FormField
            control={form.control}
            name='thread'
            render={({ field }) => (
                <FormItem className='flex w-full items-center gap-3'>
                <FormLabel>
                  <Image
                    src = {currentUserImg}
                    alt="current user"
                    width={48}
                    height={48}
                    className='rounded-full object-cover'
                  />
                </FormLabel>

                <FormControl className='border-none bg-transparent'>
                    <Input type="text" placeholder="comment ... " className='no-focus text-light-1 outline-none' {...field} />
                </FormControl>
                </FormItem>
            )}
            />
            <Button type='submit' className='comment-form_btn'>
            Reply
            </Button>
        </form>
        </Form>
  )
}

export default Comment