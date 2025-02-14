import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import useSocketGrievances from '../hooks/useSocketGrievances';
import { setOfficialgrievances, updateOfficialGrievance } from './redux/OfficialSlice';
import axios from 'axios';
import { USER_API_END_POINT } from '../utils/constant';
import { toast } from 'sonner';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
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

const status = ["pending", "in_progress", "resolved", "rejected", "escalated"];

function OfficialTable() {

  const dispatch = useDispatch();
  const grievances = useSelector(state => state.official.officialgrievances);
  const official = useSelector(state => state.auth.user);

  // Initialize socket connection for real-time updates
  useSocketGrievances();

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(`${USER_API_END_POINT}/loginofficial/verify/status/${id}/update`, 
        { status }, 
        {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(updateOfficialGrievance(res.data.grievance));
        toast.success(res.data.message);
      }
    } catch (error) {

      const errorMsg ="Status update failed";
      console.log(error.response?.data?.message || error.message)
      toast.error(errorMsg);
    }
  };
  // On mount, fetch the current grievances for this official
  useEffect(() => {
    const fetchGrievances = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/loginofficial/verify/getgrievances`, {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setOfficialgrievances(res.data.grievances));
        }
      } catch (error) {
        console.log("Error fetching grievances", error);
        toast.error("Could not fetch grievances");
      }
    };
    if (official && official.district) {
      fetchGrievances();
    }
  }, [dispatch, official]);

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
                    <PopoverContent className="w-32 cursor-pointer !opacity-100">
                      {
                        status.map((status, index) => {
                          return (
                            <div onClick={() => statusHandler(status, item?._id)} key={index}>
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
        <TableCaption className='font-bold'>List of Resolved or Rejected Grievances</TableCaption>
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
                <TableCell>{item.status}</TableCell>
              </TableRow>
            ))
          }
        </TableBody>
      </Table>
    </div>
  )
}

export default OfficialTable