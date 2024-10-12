import React from 'react'
import SideBar from '../../components/Dashboard/SideBar'
import { Outlet } from 'react-router-dom'
import './Dashboard.css' 


export default function Dashboard() {
  return (
      <div className="dashboard ">
          <SideBar/>
          <div style={{padding:"20px 100px", flex:"1", backgroundColor:"white", 
            position:"relative",
            maxWidth:"1500px"}}>
          <Outlet/>
          </div>
      </div>
  )
}
