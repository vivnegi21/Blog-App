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
import Image from "next/image"
import { Input } from "@/components/ui/input"
import {zodResolver} from "@hookform/resolvers/zod";
import { userValidation } from "@/lib/validation/user";
import { Textarea } from "../ui/textarea"
import { useState } from "react"
import { isBase64Image } from "@/lib/utils"
import {useUploadThing} from '../../lib/uploadthing';
import { updateUser } from "@/lib/actions/users.action"
import { usePathname, useRouter } from 'next/navigation';
// Component Account Profile
const AccountProfile = ({user,btnTitle}) => {

  const [files,setFiles] = useState([]);
  const {startUpload} = useUploadThing("media");
  const form= useForm({
    resolver: zodResolver(userValidation),
    defaultValues:{
      profile_photo :user?.image || "",
      name:user?.name ||'',
      username:user?.username || '',
      bio:'',
    }
  });
  const router = useRouter();
  const pathname = usePathname();

  const handleImage= (e,fieldChange)=>{
    e.preventDefault();
    const filereader= new FileReader();
    if(e.target.files && e.target.files.length>0){
      const file = e.target.files[0];

      setFiles(Array.from(e.target.files));
      
      if(!file.type.includes('image')) return;
      
      filereader.onload = async (event)=>{
        const imageData = event.target?.result?.toString() || '';
        fieldChange(imageData);
      }
      
      filereader.readAsDataURL(file);
    }
  } 
  // Upload form data on backend
  async function onSubmit(values)
  {
    const blob = values.profile_photo;

    const hasImageChanged = isBase64Image(blob);
    if(hasImageChanged){
      const imgRes = await startUpload(files);
      if(imgRes && imgRes[0].url){
        values.profile_photo = imgRes[0].fileUrl;
      }
    }

    // TODO: backend Function to upload user profile
    await updateUser({
      userId:user.id,
      username:values.username,
      name:values.name,
      bio: values.bio,
      image:values.profile_photo,
      path:pathname
    });

    if(pathname==="/profile/edit"){
        router.back();
    }else{
      router.push("/");
    }


  }

   return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-start gap-10">
      {/* Image Input FormField */}
      <FormField
        control={form.control}
        name="profile_photo"
        render={({ field }) => (

          <FormItem className='flex gap-4 items-center'>
            <FormLabel className='account-form_image-label'>
              {field.value? (
              <Image src={field.value} alt = "profile_photo" width={96} height={96} priority className="rounded-full object-contain" />):(
              <Image src="/assets/profile.svg" alt = "profile_photo" width={24} height={24} className="object-contain" />
              )}
            </FormLabel>
            <FormControl className="flex-1 text-base-semibold text-grey-200">
              <Input
              type="file"
              accept="image/*"
              placeholder="Upload A photo"
              className="account-form_image-input"
              onChange={(e)=>handleImage(e,field.onChange)}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
        />

      {/* Name Text type FormField */}
      <FormField
        control={form.control}
        name="name"
        render={({ field }) => (
          <FormItem className='flex flex-col gap-3 w-full'>
            <FormLabel className='text-base-semibold text-light-2'>Name</FormLabel>
            <FormControl>
              <Input
              className="account-form_input no-focus"
              {...field}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />

      {/* User Name FormField */}
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem className='flex gap-3 flex-col w-full'>
            <FormLabel className='text-base-semibold text-light-2'>User Name</FormLabel>
            <FormControl>
              <Input
              className="account-form_input no-focus"
              {...field}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
        />
      {/* Bio FormField */}
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem className='flex gap-3 flex-col w-full'>
            <FormLabel className='text-base-semibold text-light-2'>Bio</FormLabel>
            <FormControl>
              <Textarea
              rows={10}
              className="account-form_input no-focus"
              {...field}
              />
            </FormControl>
            <FormMessage/>
          </FormItem>
        )}
      />
      {/* Button to submit the object */}
      <Button type="submit" className="bg-primary-500">{btnTitle}</Button>
    </form>
  </Form>
   )
}

export default AccountProfile