import React, { useState } from 'react'
import './Bars.css'
import { Link, useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBookmark } from '@fortawesome/free-regular-svg-icons'
import { faArrowRightFromBracket, faCubes } from '@fortawesome/free-solid-svg-icons'
import axios from 'axios'

export default function SideBar() {
  const [current, setCurrent] = useState(0);
  const userName = localStorage.getItem("userName");
  const userImage = localStorage.getItem("userImage");

   const links = [
    {
      icon:faCubes,
      name: "Products",
      path: "/dashboard/items",
    },
    {
      icon:faBookmark,
      name: "Favorites",
      path: "#",
    },
    {
      icon:faBookmark,
      name: "order list",
      path: "#",
    },
  ]
  const navigate = useNavigate();
  function activeLink(index: number) {
    if(current === index) {
        setCurrent(0)
    }else {
        setCurrent(index);
    }
}
 async function handleLogout() {
    await axios.post('https://test1.focal-x.com/api/logout', {}, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    })
    .then(res => {
      console.log(res);
      localStorage.removeItem("token");
      navigate('/');
  }).catch(err=> console.log(err)) 
  }
  return (
    <>
        <div className='side-bar' >
          <div className="logo">
            <img src="/src/assets/images/Logo.png" alt="logo" />
          </div>
          <div className='profile'>
              {userImage && <img src={userImage} alt="User Profile" />}
              <p>{userName}</p>
          </div>
          <div className='side-bar-links'>
            {links.map((link,index) => {
              return (
                <Link 
                key={index}
                to={link.path} 
                className={current === index ? 'side-bar-link active' : 'side-bar-link'}
                onClick={() => activeLink(index)}>
                  <FontAwesomeIcon icon={link.icon}  width="24px" height="24px" />
                <p>{link.name}</p>
                </Link>
              )
            })}
            </div>
            <button className='logout'
                    onClick={handleLogout}>Logout<FontAwesomeIcon icon={faArrowRightFromBracket} className='logout-icon'/>
            </button>
        </div>
        </>
  )
}
