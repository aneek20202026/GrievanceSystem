import './App.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Navbar from './components/ui/shared/Navbar'
import Home from './components/Home'
import Contact from './components/Contact'
import Submitgrievance from './components/grievance/Submitgrievance'
import Getcitizengrievances from './components/grievance/Getcitizengrievances'
import Thankyou from "./components/ui/shared/Thankyou";
import Homemain from './components/general/Homemain'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import AdminDashboard from './components/dashboards/AdminDashboard'
import CitizenDashboard from './components/dashboards/CitizenDashboard'
import OfficialDashboard from './components/dashboards/OfficialDashboard'

const appRouter = createBrowserRouter([
  
  {
    path:'/',
    element:<Home/>
  },
  {
    path:'/contact',
    element:<Contact/>
  },
  {
    path:'/submit',
    element:<Submitgrievance/>
  },
  {
    path:'/getSubmittedGrievances',
    element:<Getcitizengrievances/>
  },
  {
    path:'/ThankYou',
    element:<Thankyou/>
  },
  {
    path:'/govt',
    element:<Homemain/>
  },
  {
    path:'/govt/login',
    element:<Login/>
  },

  {
    path:'/govt/signup',
    element:<Signup/>
  },
  {
    path:'/getcitizengrievance',
    element:<Getcitizengrievances/>
  },
  {
    path:'/admindashboard',
    element:<AdminDashboard/>
  },
  {
    path:'/citizendashboard',
    element:<CitizenDashboard/>
  },
  {
    path:'/officialdashboard',
    element:<OfficialDashboard/>
  },
])

function App() {

  return (
    <>
      <RouterProvider router={appRouter}/>
    </>
  )
}

export default App
