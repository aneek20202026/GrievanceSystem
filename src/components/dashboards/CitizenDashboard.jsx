import React from 'react'
import Navbar from '../ui/shared/Navbar'
import CitizenTable from '../CitizenTable'

function CitizenDashboard() {
  return (
    <div>
      <Navbar />
      <div className='max-w-4xl mx-auto bg-white rounded-2xl my-10'>
        <h1 className='font-bold text-l'>Submitted Grievances</h1>
        <CitizenTable />
      </div>

    </div>
  )
}

export default CitizenDashboard