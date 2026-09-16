import React, { useEffect, useState } from 'react'
import { FaGoogle } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";
import { TbPassword } from "react-icons/tb";

const Left = () => {

const [firstName, setFirstName] = React.useState("");
const [lastName, setLastName] = React.useState("");
const [email, setEmail] = React.useState("");
const [password, setPassword] = React.useState("");

const  handleSubmit =async(e)=>{
  e.preventDefault();
  const responce= await fetch("http://localhost:5000/auth/register",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
   body: JSON.stringify({
  email,
  password,
  username: firstName,
  fullname: `${firstName} ${lastName}`,
}),
  })
  const data= await responce.json()
  console.log(data);

}



  return (
  <div className="min-h-screen flex items-start justify-start pl-25 pt-8 bg-[#0a0909] h-screen w-full">
  <div className=" w-120 bg-[#0e0d0d] border border-[#2a2a2a] rounded-md shadow-[0_0_30px_rgba(0,0,0,0.8)]">
    <h1 className='text-white text-3xl pt-5 pl-4 ml-6 pr-9'>Create an account</h1>
    <p className='text-gray-400 tracking-light pt-1 pl-4 ml-6 '>Brainstorm in chat, build in cowork</p>
  
<div className='flex gap-3 '>
  <button className='border border-[#464545] text-amber-50 tracking-tight text-sm px-6 py-1 rounded-lg mt-7 ml-9 flex gap-1'><FaGoogle className='translate-y-1' /> Sign up with Google</button>
 <button className='border border-[#464545] text-amber-50 tracking-tight text-sm px-6 py-1 rounded-lg mt-7 flex mr-5 gap-1'><FaApple className='translate-y-1' /> Sign up with Apple</button>

</div>

<h1 className='text-[#464545] my-4 mx-55'>or</h1>



<div className='flex '>
  
<input  className='text-white w-46  ml-9 border border-[#464545]  text-sm rounded-lg px-1 py-2'
type="text"
 placeholder='First Name'
 value={firstName}
 onChange={(e)=>setFirstName(e.target.value)}
 >
  
 </input>
 <input  className='text-white w-46  ml-3 border border-[#464545]  text-sm rounded-lg px-2 py-2'
type="text"
 placeholder='Last Name'
 value={lastName}
 onChange={(e)=>setLastName(e.target.value)}
 >

 
 </input>
</div>


  <div className="flex items-center w-95 ml-9 h-11 rounded-lg border border-[#464545]  gap-20rounded-md px-3 mt-3">
    <span className="text-white text-sm mr-2 flex gap-1 ">Email <HiOutlineMail className='translate-y-1'/></span>
    <input
      type="text"
      className="w-full  bg-transparent  text-white outline-none text-sm"
      value={email}
onChange={(e) => setEmail(e.target.value)}
    />
  </div>

  <div className="flex items-center w-95 ml-9 h-11 rounded-lg  border border-[#464545]  gap-20rounded-md px-3 mt-3">
    <span className="text-white text-sm mr-2 flex gap-1 ">Password <TbPassword className='translate-y-1'/></span>
    <input
      type="text"
      className="w-full bg-transparent  text-white outline-none text-sm"
      value={password}
onChange={(e) => setPassword(e.target.value)}
    />
  </div>


<div className="flex items-start gap-2 mt-5 pl-6">
  <input
    type="checkbox"
    className="mt-1 w-3 h-3 cursor-pointer"
  />

  <p className="text-gray-400 text-xs ">
    I don't want to receive emails about feature updates
  </p>
</div>

<div className="flex items-start gap-2 mt-3 pl-6">
  <input
    type="checkbox"
className="w-3 h-3 cursor-pointer"
  />

  <p className="text-gray-400 text-xs ">
    By creating an account, you agree to our Terms and Services and Privacy Policy
  </p>
</div>

<button
onClick={handleSubmit}
 className='bg-white w-94 mt-6 flex items-center ml-10 py-2 rounded-lg justify-center mb-10'>
  submit
</button>

  </div>
</div>
  )
}

export default Left
