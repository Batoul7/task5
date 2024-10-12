import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Logout() {

  const navigate = useNavigate();

  useEffect(() => {
    axios.post('https://test1.focal-x.com/api/logout',{}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    })
    .then(res => {
      console.log(res);
      localStorage.removeItem("token");
      navigate('/');
  }).catch(err=> console.log(err)) 
  },[])
  return (
    <></>
  )
}
