import React from 'react'
import { Link } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

function Navbar() {
    const user = false;
    return (
        <div className='bg-white shadow-md'>
            <div className='flex items-center justify-between mx-auto p-5 max-w-7xl h-20'>
                <div>
                    <h1 className='text-2xl font-bold'>Grievance<span className='text-[#f83002]'>Portal</span></h1>
                </div>
                <div className='flex items-center gap-8'>
                    <ul className='flex font-medium item-center gap-5'>
                        <li>Home</li>
                        <li>Contact</li>
                    </ul>
                    
                    <div className='text-[#000000] border-2 hover:border-4 rounded-lg '>
                        <Popover>
                            <PopoverTrigger asChild>
                                <Button className="bg-black hover:bg-[#222222] text-[#FFFFFF]">Grievance Services</Button>
                            </PopoverTrigger>
                            <PopoverContent className="bg-white !opacity-100 shadow-md rounded-md p-4">
                                <Link to="/submit"><Button variant="link">Submit a Grievance</Button></Link>
                                <Link to="/getcitizengrievance"><Button variant="link">Your Submitted Grievances</Button></Link>
                            </PopoverContent>
                        </Popover>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Navbar