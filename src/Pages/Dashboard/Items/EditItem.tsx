import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';
import LoadingSubmit from '../../../components/Loading/Loading';
import { useNavigate, useParams } from 'react-router-dom';
import Control from '../../../components/Control/Control';
import './Item.css'

interface Item {
  id:number,
  name: string,
  price: string,
  image_url: string
}
export default function EditItem() {
  const [item, setitem] = useState<Item | null>(null);
  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  const [image, setimage] = useState<File | "">("");
  // loading
  const [loading,setLoading] = useState(false);
  // navigate
  const navigate = useNavigate();

  // Ref
  const openImage = useRef<HTMLInputElement | null>(null);
  function handleOpenImage() {
    if (openImage.current) {
      openImage.current.click();
    }
    }
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setimage(e.target.files[0]);
      }
    };
    // params 
    const params = useParams();
  
    useEffect(()=> {
      axios.get(`https://test1.focal-x.com/api/items/${params.id}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      })
      .then(res => {
        setitem(res.data);
        setname(res.data.name);
        setprice(res.data.price);
        setimage(res.data.image_url);
      })
      .catch(err => console.log(err))
    },[]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    console.log(name, price, image);
    await axios.post(`https://test1.focal-x.com/api/items/${params.id}`,{
      name: name,
      price: price,
      image: image,
      _method: 'PUT'
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then(res => {
      setLoading(false);
      console.log(res.data);
      navigate('/dashboard/items')
    })
    .catch(err => 
      { 
        setLoading(false);
        console.log(err);
     })
  }

  return (
    <>
    {loading && <LoadingSubmit/>}
    <Control/>
    <div className='edit-item'>
      <h1>EDIT ITEM</h1>
      <form onSubmit={(e)=> handleSubmit(e)}>
        <div className="input">
          <div className='info'>
            <label htmlFor="name">Name</label>
            <input type="text" id='name' 
                    defaultValue={item?.name}
                    onChange={(e)=> setname(e.target.value)}/>
            <label htmlFor="price">Price</label>
            <input type="text" id='price' 
                   defaultValue={item?.price}
                  onChange={(e)=> setprice(e.target.value)}/>
          </div>
          <div className='item-img'>
          <label htmlFor="img">Image</label>  
          <input 
               hidden
                  ref={openImage}
                  type="file"
                  onChange={handleImageUpload} />
              <div style={{display: "flex", gap:"20px"}}>
                <div className='upload-img'
                    onClick={handleOpenImage}>
                  <img alt="item image"  
                  src={ typeof image === 'string' ? item?.image_url : URL.createObjectURL(image)}  
                  height="100%"/>
                </div>
              </div>
          </div>
        </div>
        <input type='submit' value="Save" id='save'/>
      </form>
    </div>
    </>
  )
}
