import React, { useEffect, useRef, useState } from 'react'
import './Auth.css'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import LoadingSubmit from '../../components/Loading/Loading';

export default function Register() {

  const [firstName, setfirstName] = useState("");
  const [lastName, setlastName] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [passwordR, setpasswordR] = useState("");
  const [image, setimage] = useState<File>();
  const [err,setErr] = useState("");
  // loading
  const [loading,setLoading] = useState(false);

  //navigate
  const nav = useNavigate();
  // Ref focus + Ref openImage
  const focus = useRef<HTMLInputElement | null>(null);
  const openImage = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (focus.current) {
      focus.current.focus();
    }
  }, []);

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
    await axios.post('https://test1.focal-x.com/api/register', {
      first_name:firstName,
      last_name: lastName,
      user_name: firstName + '_' + lastName,
      email:email,
      password: password,
      password_confirmation:passwordR,
      profile_image: image,
    },
      {
        headers: {
          'Content-Type': 'multipart/form-data',
      },
      }
    )
    .then(res => {
      setLoading(false);
      localStorage.setItem("token", `Bearer ${res.data.data.token}`); 
      localStorage.setItem("userName", firstName + ' ' +lastName);
      localStorage.setItem("userImage", image ? URL.createObjectURL(image) : '');
      nav("/dashboard/items");
    }).catch(err => {
      setLoading(false);
      console.log(err)
      if(err.response.status === 409) {
        setErr("Email is already in use or conflict occurred");
      } else if(err.response.status === 422) {
        setErr("Email is already been token");
      } else {
          setErr("Internal server error")
      }
    })
}

  return (
    <>
    {loading && <LoadingSubmit/>}
    <div className='register'>
      <div className="form">
        <div className="head">
          <img src='/src/assets/images/Logo.png' alt='Focal X' className='logo'/>
          <h1>Sign up</h1>
          <p>Fill in the following fields to create an account.</p>
        </div>
          <form onSubmit={(e) => handleSubmit(e)}>
            <label htmlFor="name">Name</label>
            <div style={{display:"flex", gap:"24.05px", justifyContent:"space-between"}}>
              <input id='name' type="text" placeholder='First Name' ref={focus} onChange={(e)=> setfirstName(e.target.value)}/>
              <input type="text" placeholder='Last Name' onChange={(e)=> setlastName(e.target.value)} />
            </div>
            <label htmlFor="email">Email</label>
            <input id='email' type="email" placeholder='Enter your email' onChange={(e)=> setemail(e.target.value)}/>
            <label htmlFor="password">Password</label>
            <div style={{display:"flex", gap:"24.05px"}}>
              <input id='password' type="password" placeholder='Enter password' onChange={(e)=> setpassword(e.target.value)}/>
              <input type="password" placeholder='Re-enter your password' onChange={(e)=> setpasswordR(e.target.value)}/>
            </div>
            <label htmlFor="">Profile Image</label>
            <input hidden
                ref={openImage}
                type="file"
                onChange={handleImageUpload} />
            <div style={{display: "flex", gap:"20px"}}>
              <div className='upload-img'
                  onClick={handleOpenImage}>
                  <img alt="" src='/src/assets/images/Upload icon.png'
                      width="40px"/>
              </div>
              {image && <img alt="Uploaded" src={URL.createObjectURL(image)} width="100px"/>}
            </div>  
            <input type="submit" value={'SIGN UP'}/>
          </form>
          <p>Do you have an account? <Link to={"/"}>Sign in</Link></p>
          { err !== "" && <span className="error">{err}</span>}
        </div>
      </div>
      </>
  )
}
