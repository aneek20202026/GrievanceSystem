import React from 'react'
import Navbarmain from '../ui/shared/Navbarmain'
import { Mail } from 'lucide-react'
import OfficialTable from '../OfficialTable'

function OfficialDashboard() {
  return (
    <div>
      <Navbarmain />
      <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
        <div className='flex items-center gap-3 my-2'>
          <div>
            <Mail />
            <span></span>
          </div>

        </div>
      </div>

      <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
        <h1 className='font-bold text-l'>Submitted Grievances</h1>
        <OfficialTable />
      </div>
    </div>
  )
}

export default OfficialDashboard