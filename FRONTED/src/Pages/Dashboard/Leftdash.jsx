import React from 'react'
import { RiRobot3Line } from "react-icons/ri"
import { IoHomeOutline } from "react-icons/io5"
import { CiSettings, CiBookmark, CiFileOn } from "react-icons/ci"
import { MdOutlineKeyboardVoice } from "react-icons/md"
import { IoMdAddCircleOutline } from "react-icons/io"

const Leftdash = () => {
  return (
    <div className="h-screen w-56 bg-purple-100 px-3 py-4">

      <div className="px-2">

        <div className="flex items-center gap-2">
          <RiRobot3Line className="text-fuchsia-950" size={25} />

          <h1 className="font-bold text-[16px] text-gray-900 whitespace-nowrap">
            Interview AI
          </h1>
        </div>

        <span className="block text-gray-500 text-[8px] ml-8 -mt-1 whitespace-nowrap">
          Practice Today, Get Hired
        </span>

      </div>

      <div className="mt-8 space-y-2">

        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-purple-200 text-purple-900 cursor-pointer">
          <IoHomeOutline size={18} />

          <h2 className="text-[13px] font-semibold whitespace-nowrap">
            Dashboard
          </h2>
        </div>


        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-200 hover:text-purple-900 cursor-pointer transition">
          <IoMdAddCircleOutline size={18} />

          <h2 className="text-[13px] font-medium whitespace-nowrap">
            Create Interview
          </h2>
        </div>


        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-200 hover:text-purple-900 cursor-pointer transition">
          <MdOutlineKeyboardVoice size={18} />

          <h2 className="text-[13px] font-medium whitespace-nowrap">
            Voice Interviews
          </h2>
        </div>


        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-200 hover:text-purple-900 cursor-pointer transition">
          <CiFileOn size={18} />

          <h2 className="text-[13px] font-medium whitespace-nowrap">
            Resume
          </h2>
        </div>


        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-200 hover:text-purple-900 cursor-pointer transition">
          <CiBookmark size={18} />

          <h2 className="text-[13px] font-medium whitespace-nowrap">
            Saved
          </h2>
        </div>


        <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-purple-200 hover:text-purple-900 cursor-pointer transition">
          <CiSettings size={18} />

          <h2 className="text-[13px] font-medium whitespace-nowrap">
            Settings
          </h2>
        </div>

      </div>

    </div>
  )
}

export default Leftdash