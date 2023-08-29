"use client"
import { sidebarLinks } from '@/constants'
import React from 'react'
import Link from 'next/link';
import Image from "next/image"
import {useRouter, usePathname} from 'next/navigation';

function Bottombar(){
  const router = useRouter();
  const pathname = usePathname();
  return (
    <section className="bottombar">
      <div className="bottombar_container">
      {
          sidebarLinks.map((links)=>{

            const isActive = (pathname.includes(links.route) && links.route.at.length>1) || pathname===links.route;

            return (
            <Link href={links.route} key={links.label} className={`bottombar_link ${isActive && "bg-primary-500 "}`}>
            <Image src={links.imgURL} alt={links.label} width={24} height={24}/>
            <p className='text-subtle-medium text-light-1 max-sm:hidden'>
              {links.label.split(/\s+/)[0]}
              </p>
            </Link>
          )})
        }
      </div>
    </section>
  )
}

export default Bottombar