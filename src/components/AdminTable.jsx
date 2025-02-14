import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useSocketGrievances from '../hooks/useSocketGrievances';
import { setAdmingrievances } from './redux/AdminSlice';
import axios from 'axios';
import { USER_API_END_POINT, GRIEVANCE_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';
import {Popover, PopoverContent, PopoverTrigger} from './ui/popover';
import { MoreHorizontal } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx"

const status = ["pending", "in_progress", "resolved", "escalated"];



function AdminTable() {
  const dispatch = useDispatch();
  const grievances = useSelector(state => state.admin.admingrievances);
  const admin = useSelector(state => state.auth.user);

  // const sortGrievances = (grievances) => {
  //   return grievances.sort((a, b) => {
  //     // 1. Sort by date descending (newest first)
  //     const dateA = new Date(a.createdAt);
  //     const dateB = new Date(b.createdAt);
  //     if (dateB - dateA !== 0) return dateB - dateA;
      
  //     // 2. Sort by urgency
  //     // Define an order mapping for urgency:
  //     // "high" should come before "medium", which comes before "low".
  //     // We assign numeric values accordingly.
  //     // const urgencyOrder = { high: 3, medium: 2, low: 1, "": 0 };
  //     // // Get the numeric urgency value for each grievance.
  //     // const urgencyA = urgencyOrder[a.aiAnalysis.urgency] || 0;
  //     // const urgencyB = urgencyOrder[b.aiAnalysis.urgency] || 0;
  //     // if (urgencyB - urgencyA !== 0) return urgencyB - urgencyA;
      
  //     // 3. Sort by status (customizable order)
  //     // Here we define an order mapping for status.
  //     // Lower numbers will come first. In this mapping, "pending" is lowest,
  //     // then "in_progress", "escalated", and finally "resolved".
  //     const statusOrder = { pending: 1, in_progress: 2, escalated: 3, resolved: 4 };
  //     const statusA = statusOrder[a.status] || 0;
  //     const statusB = statusOrder[b.status] || 0;
  //     return statusA - statusB;
  //   });
  // };
  

  // Initialize socket connection for real-time updates
  
  useSocketGrievances();

  const statusHandler = async(status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${GRIEVANCE_API_END_POINT}/status/${id}/update`, { status });
      if (res.data.success) {
        toast.success(res.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  // On mount, fetch the current grievances for this official
  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/loginadmin/verify/getadmingrievances`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setAdmingrievances(res.data.grievances));
        }
      } catch (error) {
        console.log("Error fetching grievances", error);
        toast.error("Could not fetch grievances");
      }
    };
    if (admin) {
      fetchGrievances();
    }
  }, [dispatch, admin]);

  // Filter grievances into active and closed
  const activeGrievances = grievances.filter(
    (g) => g.status !== "resolved" && g.status !== "rejected"
  );
  const closedGrievances = grievances.filter(
    (g) => g.status === "resolved" || g.status === "rejected"
  );

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
            <TableHead className='text-center'>status</TableHead>
            {/* <TableHead></TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            activeGrievances.length <= 0 ? <span>No Grievance Found</span> : activeGrievances.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.createdAt.split("T")[0]}</TableCell>
                <TableCell>{item.district}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.aiAnalysis.urgency}</TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                    {
                      status.map((status, index) => {
                        return (
                          <div onClick={()=> statusHandler(status, item?._id)} key={index}>
                            <span>{status}</span>
                          </div>
                        )
                      })
                    }
                  </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>

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
            <TableHead className='text-center'>status</TableHead>
            {/* <TableHead></TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {
            closedGrievances.length <= 0 ? <span>No Grievance Found</span> : closedGrievances.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.createdAt.split("T")[0]}</TableCell>
                <TableCell>{item.district}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell>{item.aiAnalysis.urgency}</TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger>
                      <MoreHorizontal />
                    </PopoverTrigger>
                    <PopoverContent className="w-32">
                    {
                      status.map((status, index) => {
                        return (
                          <div onClick={()=> statusHandler(status, item?._id)} key={index}>
                            <span>{status}</span>
                          </div>
                        )
                      })
                    }
                  </PopoverContent>
                  </Popover>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default AdminTable