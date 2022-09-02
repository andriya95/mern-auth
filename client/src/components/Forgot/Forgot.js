import Input from "../Input/Input";
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";
import { isEmpty, isEmail } from "../helper/validate";
import { useState } from 'react';


const Forgot = () => {
  const[email, setEmail] = useState('');
  
  const handleChange = (e) => {
    setEmail(e.target.value);
  }

  const handleReset = () => {
    Array.from(document.querySelectorAll("input")).forEach(
      (input) => (input.value = '')
    );
    setEmail({ email: '' });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
    //check fields
    if(isEmpty(email)) {
      return toast('Please fill in all the fields', {
        className: 'toast-failed',
        bodyClassName: 'toast-failed'
      });
    }
    //check email
    if(!isEmail) {
      return toast('Please enter the valid email adress', {
        className: 'toast-failed',
        bodyClassName: 'toast-failed'
      });
    }

    try {
      await axios.post('/v1/api/auth/forgot_pass', { email });
      handleReset();

      return toast('Please check your email', {
        className: 'toast-success',
        bodyClassName: 'toast-success'
      });

    } catch(err) {
      toast(err.response.data.error, {
        className: 'toast-failed',
        bodyClassName: 'toast-failed'
      });
    }
  }

  return (
    <>
      <ToastContainer />
      <form onSubmit={handleSubmit}>
        <Input type="text" text="Email" name='email' handleChange={handleChange} />
        <div className="login_btn">
          <button type="submit">send</button>
        </div>
      </form>
    </>
  );
}
 
export default Forgot;