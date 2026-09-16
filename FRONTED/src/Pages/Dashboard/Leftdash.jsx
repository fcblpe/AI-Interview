import React from 'react'
import { RiRobot3Line } from "react-icons/ri";
import { IoHomeOutline } from "react-icons/io5";
import { CiSettings } from "react-icons/ci";
import { CiBookmark } from "react-icons/ci";
import { CiFileOn } from "react-icons/ci";
import { MdOutlineKeyboardVoice } from "react-icons/md";
import { IoMdAddCircleOutline } from "react-icons/io";


const Leftdash = () => {
  return (
    <div className='h-screen w-50 bg-purple-100'>

      <div className='px-2 py-4'>
        
        <div className='flex items-center gap-1'>
          <RiRobot3Line className='text-fuchsia-950' size={24} />
          <h1 className='font-bold -translate-y-1'>Interview AI</h1>
        </div>

        <span className='block  text-gray-500 text-[8px] tracking-tight ml-7 -mt-2 whitespace-nowrap'>
          Practice Today, Get Hired 
        </span>
      </div>

<div className='flex px-5 mt-5 gap-0.5'>
<IoHomeOutline className='text-gray-500'size={17} />
<h2 className=' text-[14px] font-medium text-gray-500'>Dashboard</h2>
</div>
<div className='flex px-5 mt-6 gap-0.5'>
<IoMdAddCircleOutline  className='text-gray-500'size={17} />
<h2 className=' text-[13px] font-medium text-gray-600'>Create Interview</h2>

</div>
<div className='flex px-5 mt-6'>
<MdOutlineKeyboardVoice className='text-gray-600' size={17} />
<h2 className=' text-[14px] font-medium text-gray-600 tracking-tight'>Voice Interviews</h2>
</div>
<div className='flex px-5 mt-6 gap-0.5'>
<CiFileOn className='translate-y-0.5'size={16}/>
<h2 className=' text-[14px] font-medium text-gray-500'>Resume</h2>

</div>
<div className='flex px-5 mt-6 gap-0.5'>
<CiBookmark className='translate-y-0.5' size={15} />
<h2 className=' text-[14px] font-medium text-gray-500'>Saved</h2>

</div>
<div className='flex px-5 mt-6 gap-0.5'>
<CiSettings  size={17}/>
<h2 className=' text-[14px] font-medium text-gray-500'>Settings</h2>

</div>


    </div>
  )
}

export default Leftdash
