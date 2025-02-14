import React from 'react'
import Navbarmain from '../ui/shared/Navbarmain'
import { Contact, Mail } from 'lucide-react'
import AdminTable from '../AdminTable'

function AdminDashboard() {
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
        <h1 className='text-l font-bold'>Submitted Grievances</h1>
        <AdminTable />
      </div>

    </div>
  )
}

export default AdminDashboard