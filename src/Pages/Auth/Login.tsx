import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LoadingSubmit from '../../components/Loading/Loading';

export default function Login() {
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [err,setErr] = useState("");
    // loading
    const [loading,setLoading] = useState(false);
    // navigate
    const nav = useNavigate();
    // Ref focus 
    const focus = useRef<HTMLInputElement | null>(null);
      useEffect(() => {
        if (focus.current) {
          focus.current.focus();
        }
      }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setLoading(true);
      await axios.post('https://test1.focal-x.com/api/login', {
        email:email,
        password:password,
      })
      .then(res => {
          setLoading(false);
          console.log(res);
          localStorage.setItem("token", `Bearer ${res.data.token}`); 
          localStorage.setItem("userImage", res.data.user.profile_image_url); 
          localStorage.setItem("userName", res.data.user.first_name + ' ' + res.data.user.last_name); 
          nav("/dashboard/items");
        }).catch(err => {
          setLoading(false);
          if(err.response.status === 401) {
              setErr("Email or Password is not correct");
          } else {
              setErr("Internal Server Error")
          }
        })
    }

  return (
    <>
    {loading && <LoadingSubmit/>}
    <div className='login'>
        <div className="form">
            <div className="head">
            <img src='/src/assets/images/Logo.png' alt='Focal X' className='logo'/>
            <h1>Sign in</h1>
            <p>Enter your credentials to access your account</p>
            </div>
            <form onSubmit={(e) => handleSubmit(e)}>
                <label htmlFor="email">Email</label>
                <input type="email" id='email' 
                      placeholder='Enter your email'  
                      onChange={(e)=> setemail(e.target.value)}
                      ref={focus}/>
                <label htmlFor="password">Password</label>
                <input type="password" 
                      placeholder='Enter your password'  
                      onChange={(e)=> setpassword(e.target.value)}/>
                <input type="submit" value={'SIGN IN'}/>
                <p>Don’t have an account? <Link to={"/register"}>Create one</Link></p>
            </form>
            { err !== "" && <span className="error">{err}</span>}
        </div>
    </div>
    </>
  )
}
