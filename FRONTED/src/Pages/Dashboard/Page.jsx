import React from 'react'
import Leftdash from './Leftdash'
import Rightdash from './Rightdash'

const Page = () => {
  return (
    <div className='h-screen w-full gap-2 bg-white flex'>  
      <Leftdash/>
      <Rightdash/>
    </div>
  )
}

export default Page
