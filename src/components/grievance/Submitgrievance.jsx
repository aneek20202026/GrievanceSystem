import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Label } from "@/components/ui/label";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import Otpinput from "../verify/Otpinput";
import axios from "axios";
import { GRIEVANCE_API_END_POINT } from "../../utils/constant";
import { toast } from "sonner";
import Navbar from "../ui/shared/Navbar";

const districts = [
  "Agra",
  "Aligarh",
  "Ambedkar Nagar",
  "Amethi",
  "Amroha",
  "Auraiya",
  "Azamgarh",
  "Baghpat",
  "Bahraich",
  "Ballia",
  "Balrampur",
  "Banda",
  "Barabanki",
  "Bareilly",
  "Budaun",
  "Basti",
  "Bhadohi",
  "Bijnor",
  "Bulandshahr",
  "Chandauli",
  "Chitrakoot",
  "Deoria",
  "Etah",
  "Etawah",
  "Faizabad",
  "Farrukhabad",
  "Fatehpur",
  "Prayagraj",
  "Gautam Buddha Nagar",
  "Ghaziabad",
  "Ghazipur",
  "Gonda",
  "Gorakhpur",
  "Hamirpur",
  "Hapur",
  "Hardoi",
  "Hathras",
  "Jalaun",
  "Jaunpur",
  "Jhansi",
  "Kannauj",
  "Kanpur Dehat",
  "Kanpur Nagar",
  "Kasganj",
  "Kaushambi",
  "Kushinagar",
  "Kheri",
  "Lalitpur",
  "Lucknow",
  "Maharajganj",
  "Mahoba",
  "Mainpuri",
  "Mathura",
  "Mau",
  "Meerut",
  "Mirzapur",
  "Moradabad",
  "Muzaffarnagar",
  "Pilibhit",
  "Pratapgarh",
  "Raebareli",
  "Rampur",
  "Saharanpur",
  "Samastipur",
  "Sant Kabir Nagar",
  "Shahjahanpur",
  "Shamli",
  "Shravasti",
  "Siddharthnagar",
  "Sitapur",
  "Sonbhadra",
  "Sultanpur",
  "Unnao",
  "Varanasi",
  "Ayodhya",
  "Maha kumbh area of Prayagraj",
];

function GrievanceForm() {

  const [showOtpInput, setShowOtpInput] = useState(false);

  const [input, setInput] = useState({
    title: "",
    description: "",
    district: "",
    contact: "",
    file: ""
  });

  const [otp, setotp] = useState("")

  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFilehandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const regex = /[^0-9]/g;
    // if (e.target.contact.length < 10 || regex.test(e.target.contact)) {
    //   alert("Invalid Phone Number")
    //   return;
    // }

    const formdata = new FormData();
    formdata.append("title", input.title);
    formdata.append("description", input.description);
    formdata.append("district", input.district);
    formdata.append("contact", input.contact);
    if (input.file) {
      formdata.append("file", input.file);
    }

    // const data = {
    //   title: input.title,
    //   description: input.description,
    //   district: input.district,
    //   contact: input.contact,
    // };

    try {
      const res = await axios.post(`${GRIEVANCE_API_END_POINT}/grievancesubmission`, formdata, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true,
      });
      if (res.data.success) {
        toast.success(res.data.message);
      }

    } catch (error) {
      console.log(error);
      toast.error("Error in sending the otp, please try again");
    }


    // Here you would typically send the data to your backend
    // try {
    //   const res = await axios.post(`${GRIEVANCE_API_END_POINT}/grievancesubmission`,formdata,{
    //     headers:{
    //       "Content-Type":"multipart/form-data"
    //     },
    //     withCredentials:true,
    //   });

    //   console.log(formdata);
    //   if (res.data.success) {
    //     toast.success(res.data.message);
    //   }

    // } catch (error) {
    //   console.log(error);
    // }



    //show OTP field
    setShowOtpInput(true);

  };

  const onOtpSubmit = async (OTP) => {
    // const data = {
    //   "otp": OTP
    // };
    setotp(OTP);
    try {
      const res = await axios.post(`${GRIEVANCE_API_END_POINT}/grievancesubmission/verifyotp`, { otp: OTP }, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });

      if (res.data.success) {
        navigate("/ThankYou");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Verification Failed");
    }
  }

  return (
    <div>
      <Navbar />
      <div className="flex items-center justify-center bg-gray-50 mt-4">
        <div className="shadow-xl rounded-lg sm:w-[350px] md:w-[350px] lg:w-[650px] p-8 bg-white">

          <h1 className="text-center font-bold text-2xl mb-4 mt-4">Grievance Submission Form</h1>
          {!showOtpInput ? <form onSubmit={handleSubmit} className="space-y-6">
            {/* District Select */}
            <div className="space-y-2">
              <label htmlFor="district" className="block mb-2 text-md font-bold">District</label>
              <select id="district" value={input.district} name="district" onChange={changeEventHandler} >
                <option value="">-- Select a District --</option>
                {districts.map((dist, index) => (
                  <option className="px-4 py-2 rounded-md outline-none w-full" key={index} value={dist}>{dist}</option>
                ))}
              </select>
            </div>

            {/* Title Input */}
            <div className="space-y-2">
              <label htmlFor="title" className="block mb-2 text-md font-bold">Title</label>
              <input
                type="text"
                id="title"
                value={input.title}
                name="title"
                onChange={changeEventHandler}
                placeholder="Enter the title of your grievance"
                className="px-4 py-2 rounded-lg outline-none w-full bg-gray-200"
                required
              />
            </div>

            {/* Description Textarea */}
            <div className="flex-y justify-center rounded-lg items-center space-y-3">
              <lable htmlFor="description" className="block mb-2 text-md font-bold">Description</lable>
              <textarea
                id="description"
                value={input.description}
                name="description"
                onChange={changeEventHandler}
                placeholder="Describe your grievance in detail"
                required
                className="px-4 py-2 rounded-lg outline-none w-full bg-gray-200"
              />
            </div>

            {/* File Input */}
            <div className="flex-y space-y-2">
              <label htmlFor="attachments" className="block mb-2 text-md font-bold">Supporting Attachment (Image)</label>
              <input
                id="file"
                type="file"
                accept="image/*"
                onChange={changeFilehandler}
                className="rounded-lg"
              />

            </div>

            {/* Phone Input */}
            <div className="flex-y space-y-2">
              <label htmlFor="contact" className="block mb-2 text-md font-bold">Phone</label>
              <input
                id="contact"
                type="text"
                value={input.contact}
                name="contact"
                onChange={changeEventHandler}
                placeholder="Enter Your Phone number"
                required
                className="px-4 py-2 rounded-lg outline-none w-full bg-gray-200"
              />
            </div>

            <div className="text-center ">
              <button type="submit" className="w-full button">Submit Grievance</button>
            </div>
          </form> : <div className="flex items-center justify-between">
            <p className="block mb-2 text-md font-bold mt-2">Enter The OTP sent to {input.contact}</p>
            <Otpinput length={4} onOtpSubmit={onOtpSubmit} />
          </div>
          }
        </div >
      </div >
    </div>

  );
}
export default GrievanceForm