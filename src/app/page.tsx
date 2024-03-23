"use client"
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const userId = Cookies.get("userId");
  useEffect(()=>{
    if (userId) {
      router.push("/categories");
    }else{
      router.push("/login")
    }
  },[router, userId])
  // false commit

  return <div className="bg-[#FFFFFF]">

  </div>;
}
