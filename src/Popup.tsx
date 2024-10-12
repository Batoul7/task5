import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

interface Item {
  id: number;
  name: string;
  image_url: string;
  price: number;
  created_at: string;
  updated_at: string;
}

export default function EditItem() {
  const [item, setItem] = useState<Item | null>(null);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState<File | string>(''); // File for new upload, string for URL
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Fetch item data from API
    axios
      .get(`https://test1.focal-x.com/api/items/${params.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setItem(res.data);
        setName(res.data.name);
        setPrice(res.data.price);
        setImage(res.data.image_url); // Initially set image as URL
      })
      .catch((err) => console.error(err));
  }, [params.id]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]); // Set image to File object
    }
  };

  const handleOpenImage = () => {
    if (imageInputRef.current) {
      imageInputRef.current.click(); // Simulate click on file input
    }
  };

  const convertUrlToFile = async (url: string, fileName: string) => {
    const response = await fetch(url);
    const blob = await response.blob();
    return new File([blob], fileName, { type: blob.type });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('price', price);

    // If image is a File (new image uploaded), append it; if not, keep the current URL
    if (typeof image === 'string') {
      const file = await convertUrlToFile(image, 'image.jpg');
      formData.append('image', file);
    } else {
      formData.append('image', image);
    }

    // Send updated data to the API
    await axios
      .put(`https://test1.focal-x.com/api/items/${params.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      })
      .then((res) => {
        setLoading(false);
        console.log(res.data);
        navigate('/dashboard/items');
      })
      .catch((err) => {
        setLoading(false);
        console.error(err);
      });
  };

  return (
    <div className='add'>
      <h1>EDIT ITEM</h1>
      <form onSubmit={handleSubmit}>
        <div className='input'>
          <div className='info'>
            <label htmlFor='name'>Name</label>
            <input
              type='text'
              id='name'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <label htmlFor='price'>Price</label>
            <input
              type='text'
              id='price'
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          <div className='item-img'>
            <label htmlFor='img'>Image</label>
            <input
              type='file'
              ref={imageInputRef}
              hidden
              onChange={handleImageUpload}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '1px dashed gray',
                padding: '10px',
                width: '250px',
                height: '250px',
                cursor: 'pointer',
              }}
              onClick={handleOpenImage}
            >
              {typeof image === 'string' ? (
                <img
                  src={image}
                  alt='Product'
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                />
              ) : (
                <p>Click to upload new image</p>
              )}
            </div>
          </div>
        </div>
        <input type='submit' value='Save' id='save' />
      </form>
      {loading && <p>Loading...</p>}
    </div>
  );
}
