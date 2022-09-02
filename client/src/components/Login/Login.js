import { useContext, useState } from 'react';
//import {FcGoogle} from 'react-icons/fc';
import {MdVisibility} from 'react-icons/md';
import {MdVisibilityOff} from 'react-icons/md'
import Input from "../Input/Input";
import "./login.css"
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { isEmpty, isEmail } from "../helper/validate";
import { AuthContext } from '../../context/AuthContext';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';


const initialState = {
  name: '',
  password: ''
}


const Login = () => {
  const [visible, setVisible] = useState(false);
  const [data, setData] = useState(initialState);
  const { email, password } = data;
  const { dispatch } = useContext(AuthContext);
  
  const handleClick = () => {
    setVisible(!visible);
  }

  const handleChange = (e) => {
    setData({...data, [e.target.name]: e.target.value});
  };

  const login = async(e) => {
    e.preventDefault()
    //check fields
    if (isEmpty(email) || isEmpty(password)) {
      return toast('Please fill in all fields!', {
        className: 'toast-failed',
        bodyCLassName: 'toast-failed'
      });
    }
    //check email
    if (!isEmail(email)) {
      return toast('Please enter a valid email!', {
        className: 'toast-failed',
        bodyClassName: 'toast-failed'
      });
    }
    
    try {
      await axios.post('/v1/api/auth/signin', { email, password });

      localStorage.setItem('_appSignin', true);
      dispatch({ type: "SIGNIN" });

    } catch(err) {
      toast(err.response.data.error, {
        className: 'toast-failed',
        bodyClassName: 'toast-failed'
      });
    }
  }

  const googleSuccess = async(res) => {
    const token = res.credential;
    
    try {
      await axios.post('/v1/api/auth/google_signin', { tokenId: token });
      localStorage.setItem('_appSignin', true);
      dispatch({ type: "SIGNIN" });

    } catch(err) {
      toast(err.response.data.error, {
        className: 'toast-failed',
        bodyCLassName: 'toast-failed'
      });
    }
  }

  const googleError = (err) => {
    toast(err.response.data.error, {
      className: 'toast-failed',
      bodyClassName: 'toast-failed'
    });
  };
  

  return (
    <>
      <ToastContainer />
      <form className="login" onSubmit={login}>
        <Input type="email" text="Email" name="email" handleChange={handleChange} />
        <Input
          name="password" 
          type={visible ? 'text' : 'password'} 
          icon={visible ? <MdVisibility /> : <MdVisibilityOff />} 
          text="Password"
          handleClick={handleClick}
          handleChange={handleChange}
          />
        <div className="login_btn">
          <button type="submit">login</button>
          <GoogleOAuthProvider >
            <GoogleLogin
              client_id={process.env.REACT_APP_G_CLIENT_ID}
              onSuccess={googleSuccess}
              onFailure={googleError}
            />
          </GoogleOAuthProvider>
        </div>
      </form>
    </>
  );
};

export default Login;