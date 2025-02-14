import { useEffect } from "react";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { addOfficialGrievance, updateOfficialGrievance } from "../components/redux/OfficialSlice"; // for officials
import { addAdminGrievance } from "../components/redux/AdminSlice";       // for admin

// Initialize socket connection (adjust URL if needed)
const socket = io("http://localhost:8000");

const useSocketGrievances = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user.user); // Get logged-in user details
  useEffect(() => {
    socket.on("newGrievance", (data) => {
      // Check if a user is logged in
      console.log(data.district);

      if (user) {
        // If the logged-in user is an official, perform department and district check
        if (user.role === "official") {
          if(data.category=="NULL"){
            if (data.district === user.district) {
              dispatch(addOfficialGrievance(data));
            }
          }
          else{
            if (data.district === user.district && data.category === user.department) {
              dispatch(addOfficialGrievance(data));
            }
          }        
        }
        // If the logged-in user is an admin, no filtering is required
        else if (user.role === "admin") {
          dispatch(addAdminGrievance(data));
        }
      }
    });
    socket.on("updateGrievance", (data) => {
      // Check if a user is logged in
      console.log(data.district);

      if (user.role === "official") {
        // If the logged-in user is an official, perform department and district check
        
          if (data.district === user.district) {
            dispatch(updateOfficialGrievance(data));
          }
        
        // // If the logged-in user is an admin, no filtering is required
        // else if (user.role === "admin") {
        //   dispatch(addAdminGrievance(data));
        // }
      }
    });

    // Cleanup the socket listener on component unmount
    return () => {
      socket.off("newGrievance");
      socket.off("updateGrievance");
    };
  }, [dispatch, user]);
};

export default useSocketGrievances;
