'use client'
import React, { useEffect, useState } from 'react'
import { FaMoon } from "react-icons/fa";
import { CiLight } from "react-icons/ci";
import { useTheme } from 'next-themes';





export const ThemeSwitcher = () => {
    const [mounted, setMounted]=useState(false);
    const {theme, setTheme}=useTheme();
    useEffect(()=>setMounted(true),[])
   


    if(!mounted){return null}
    
    return(
        <div className="flex items-center justify-center p-4" >
            {
                theme==="light"?
                (<CiLight
                    className='cursor-pointer fill-black size-25' onClick={()=>setTheme("dark")} />):(<FaMoon
                    className='cursor-pointer size-25  fill-white ' onClick={()=>setTheme("light")}/>)
            }
        </div>
    )

  
}

export default ThemeSwitcher
