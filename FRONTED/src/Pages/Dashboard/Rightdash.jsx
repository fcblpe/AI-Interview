import React from 'react'
import { FaRegFileAlt } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa";
import { MdAccessTime } from "react-icons/md";
import { RiShoppingBag4Fill } from "react-icons/ri";
const Rightdash = () => {
  return (
    <div className=''>
      <div className='mt-2 ml-4 h-3'>  
        <input type='text' placeholder='Search anything..' className=' h-7 rounded-lg w-63 px-4 bg-gray-100 '></input></div>
 <div className='bg-purple-100 mt-7 h-screen w-260 rounded-2xl'>
  <div className='ml-3 flex'>
  <h1 className='font-bold text-2xl '>Good Moring,Sakshi</h1>
  </div>
   <span className='ml-85  inline relative mt-10'>pratice with purpose</span>
<span className=' ml-3 text-xs tracking-tight text-gray-500 -mt-3 '>Lets keep going! your Dream Job is Closer Than You</span>
     
     <div className='flex gap-0'> 
      <div className='bg-white h-23 w-45 mx-2 mt-8 rounded-2xl flex'>
       <div className='bg-purple-200 w-9 h-8 mt-2 ml-2 relative rounded-lg'>
  <FaRegFileAlt className='absolute mt-2 ml-2 text-purple-900 text-xl'size={16} />
</div>
        <h1 className='text-[11px] ml-2 pt-3 text-gray-500 font-medium'>Total Interviews</h1></div>

        <div className='bg-white h-23 w-45  mt-8 rounded-2xl flex'>
       <div className='bg-orange-200 w-9 h-8 mt-2 ml-2 relative rounded-lg'>
  <FaRegStar className='absolute mt-2 ml-2 text-orange-900 text-xl'size={18} />
</div>
        <h1 className='text-[11px] ml-2 pt-3 text-gray-500 font-medium'>Average Score</h1></div>
        <div className='bg-white h-23 w-45  mx-2 mt-8 rounded-2xl flex'>
    
       <div className='bg-blue-200 w-9 h-8 mt-2 ml-2 relative rounded-lg'>
  <MdAccessTime className='absolute mt-1 ml-2 text-blue-900 text-xl'size={20} />
</div>
        <h1 className='text-[11px] ml-2 pt-3 text-gray-500 font-medium'>Pratice Hours</h1></div>
        <div className='bg-white h-23 w-45   mt-8 rounded-2xl flex'>
    
       <div className='bg-green-200 w-9 h-8 mt-2 ml-2  relative rounded-lg'>
  <RiShoppingBag4Fill  className='absolute mt-2 ml-2 text-green-900 text-xl'size={17} />
</div>
        <h1 className='text-[11px] ml-2 pt-3 text-gray-500 font-medium'>Interviews Completed</h1></div>
     </div>
       










    </div>

    


    
    </div>
   
  )
}

export default Rightdash

