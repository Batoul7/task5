import React, { useEffect, useState } from 'react'
import Control from '../../../components/Control/Control'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './Item.css'

interface Item {
  id:number,
  name: string,
  price: string,
  image_url: string,
  created_at: string,
  updated_at: string
}
export default function ShowItem() {

  const [item, setitem] = useState<Item | null>(null);
  const params = useParams();

  useEffect(()=> {
    axios.get(`https://test1.focal-x.com/api/items/${params.id}`,{
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    })
    .then(res => setitem(res.data))
    .catch(err => console.log(err))
  },[]);

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-GB', options);
};

  return (
    <>
     <Control/>
    <div className='show'>
        <h1>{item?.name}</h1>
        <div style={{textAlign:"center"}}>
        <img src={item?.image_url} alt='item'/>
        </div>
        <div className="desc" 
            style={{paddingTop:"40px",display:"flex", flexWrap:"wrap",justifyContent:"space-between"}}>
          <p>Price: <span>{item?.price}</span></p>
          <p>Added At: <span>{item && formatDate(item.created_at)}</span></p>
          <p>Updated At: <span>{item && formatDate(item.updated_at)}</span></p>
        </div>
    </div>
    </>
  )
}
