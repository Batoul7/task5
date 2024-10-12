import React, { useRef, useState } from 'react'
import axios from 'axios';
import LoadingSubmit from '../../../components/Loading/Loading';
import { useNavigate } from 'react-router-dom';
import Control from '../../../components/Control/Control';
import './Item.css'

export default function AddItem() {
  const [name, setname] = useState("");
  const [price, setprice] = useState("");
  const [image, setimage] = useState<File | null>(null);
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

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    await axios.post('https://test1.focal-x.com/api/items',{
      name: name,
      price: price,
      image: image
    }, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      }
    })
    .then(res => {
      console.log(res.data);
      navigate('/dashboard/items')
    })
    .catch(err =>
     { setLoading(false);
       console.log(err);
      })
  }

  return (
    <>
    {loading && <LoadingSubmit/>}
    <Control/>
    <div className='add'>
      <h1>ADD NEW ITEM</h1>
      <form onSubmit={(e)=> handleSubmit(e)}>
        <div className="input">
          <div className='info'>
            <label htmlFor="name">Name</label>
            <input type="text" id='name' onChange={(e)=> setname(e.target.value)}/>
            <label htmlFor="price">Price</label>
            <input type="text" id='price' onChange={(e)=> setprice(e.target.value)}/>
          </div>
          <div className='item-img'>
          <label htmlFor="img">Image</label>  
          <input hidden
                  ref={openImage}
                  type="file"
                  onChange={handleImageUpload} />
              <div style={{display: "flex", gap:"20px"}}>
                <div className='upload-img'
                    onClick={handleOpenImage}>
                  {!image ? 
                  (<img alt="" src='/src/assets/images/Upload icon.png'/>
                  ) : ( 
                  <img alt="Uploaded" src={URL.createObjectURL(image)} />)
                  } 
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
