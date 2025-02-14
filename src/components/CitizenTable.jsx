import React from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx"
import { useSelector } from 'react-redux';
import { setGrievances } from './redux/CitizenSlice'

function CitizenTable() {
  // const dispatch = useDispatch();
  const grievances = useSelector(state => state.citizen?.grievances || []);
  return (
    <div>
      <Table>
        <TableCaption className='font-bold'>List of Citizen Grievances</TableCaption>
        <TableHeader>
          <TableRow >
            <TableHead className='text-center'>Date</TableHead>
            <TableHead className='text-center'>District</TableHead>
            <TableHead className='text-center'>Title</TableHead>
            <TableHead className='text-center'>Description</TableHead>
            <TableHead className='text-center'>Category</TableHead>
            <TableHead className='text-center'>Urgency</TableHead>
            <TableHead className='text-center'>Status</TableHead>
            {/* <TableHead></TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            grievances.length <= 0 ? <span>No Grievance Found</span> : grievances.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.createdAt.split("T")[0]}</TableCell>
                <TableCell>{item.district}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className=''>{item.status}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default CitizenTable