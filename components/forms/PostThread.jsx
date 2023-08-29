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
import { Textarea } from "../ui/textarea"
import { updateUser } from "@/lib/actions/users.action"
import { usePathname, useRouter } from 'next/navigation';

import { threadValidation } from "@/lib/validation/thread";
import { createThread } from "@/lib/actions/thread.action";

const PostThread = ({userId}) => {
    const router = useRouter();
    const pathname = usePathname();

    const form = useForm({
      resolver: zodResolver(threadValidation),
      defaultValues: {
        thread: "",
        accountId: userId,
      },
    });

    async function onSubmit(values){
        console.log("Button");
        await createThread({
          text: values.thread,
          author: userId,
          communityId: null,
          path: pathname,
        });
    
        router.push("/");
      };
    return (
        <Form {...form}>
        <form
            className='mt-10 flex flex-col justify-start gap-10'
            onSubmit={form.handleSubmit(onSubmit)}
        >
            <FormField
            control={form.control}
            name='thread'
            render={({ field }) => (
                <FormItem className='flex w-full flex-col gap-3'>
                <FormLabel className='text-base-semibold text-light-2'>Content</FormLabel>
                <FormControl className='no-focus border border-dark-4 bg-dark-3 text-light-1'>
                    <Textarea rows={15} {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
            />
            <Button type='submit' className='bg-primary-500'>
            Post Thread
            </Button>
        </form>
        </Form>
    
    )
}

export default PostThread