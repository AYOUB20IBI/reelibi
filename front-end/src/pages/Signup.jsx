import { useEffect, useState } from 'react';
import signupStyle from './Signup.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SignUpApi } from '../redux-store/Api';
import { toast } from 'react-toastify';
import logo from '../assets/images/logo/logo.png'
export default function Signup() {
  const [showPass, setShowPass] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    name: '',
    gender:''
  });

  const [errors, setErrors] = useState({
    ErrorEmail: '',
    ErrorPassword: '',
    ErrorUsername: '',
    ErrorName: '',
    ErrorGender:'',
    ErrorsAll: ''
  });

  const [picture, setPicture] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const SignUpSubmit = async (e) => {
    e.preventDefault();

    const inputData = new FormData();
    inputData.append('email', formData.email);
    inputData.append('password', formData.password);
    inputData.append('username', formData.username);
    inputData.append('name', formData.name);
    inputData.append('gender', formData.gender);
    if (picture) {
      inputData.append('avatar', picture);
    }

    try {
      const res =await SignUpApi(inputData)
      if (res?.status === 200) {
        dispatch({ type: 'LOGIN', payload: res.data.user });
        setErrors({ ErrorAll: res.data.message ? res.data.message : '' });
        toast.success("God Job")
        navigate('/login');
      }
    } catch (err) {
      if (err.response.status === 422) {
        setErrors({
          ErrorEmail: err.response.data.errors.email || '',
          ErrorPassword: err.response.data.errors.password || '',
          ErrorUsername: err.response.data.errors.username || '',
          ErrorName: err.response.data.errors.name || '',
          ErrorGender: err.response.data.errors.gender || '',
        });
      } else if (err.response.status === 404) {
        setErrors({
          ErrorAll: err.response.data.message || ''
        });
      }
    }
  };

  const PhotoHandle = (e) => {
    setPicture(e.target.files[0]);
  };

  useEffect(()=>{
    document.title = "REELIBI | Sign Up"
  },[])

  return (
    <section className="py-3 py-md-5 py-xl-8" style={{ marginTop: '6rem' }}>
      <div className={`${signupStyle.signup} container`}>
        <div className="row gy-4 align-items-center justify-content-center">
          <div className="col-12 col-md-6 col-xl-5">
            <div className={`${signupStyle.signup_form} card`}>
              <div className="card-body p-3 p-md-4 p-xl-5">
                <div className="row">
                  <div className="col-12">
                    <div className="mb-4">
                      <div className='d-flex align-items-center justify-content-center'>
                        <span >
                          <img src={logo} alt="" style={{ width: "200px", height: "100%" }} />
                        </span>
                      </div>
                      <div>
                        <p className={`${signupStyle.signup_top_para}`}>
                          Sign up to see photos and videos from your friends.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <form encType="multipart/form-data" onSubmit={SignUpSubmit}>
                  {errors.ErrorAll && 
                    <p className='mt-1 text-danger'>{errors.ErrorAll}</p>
                  }
                  <input type="file" name="avatar" onChange={PhotoHandle} className='d-none'/>
                  <div className="row gy-2 overflow-hidden">
                    <div className="col-12">
                      <div className="form-floating mb-2">
                        <input 
                          type="email" 
                          value={formData.email} 
                          className="form-control shadow-none" 
                          name="email" 
                          id="email" 
                          placeholder="name@example.com" 
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                        />
                        <label htmlFor="email" className="form-label">Email</label>
                        {errors.ErrorEmail && 
                          <p className='mt-1 text-danger'>{errors.ErrorEmail}</p>
                        }
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-2">
                        <input 
                          type="text" 
                          value={formData.name} 
                          className="form-control shadow-none" 
                          name="name" 
                          id="fullname" 
                          placeholder="Full Name" 
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                        />
                        <label htmlFor="fullname" className="form-label">Full Name</label>
                        {errors.ErrorName && 
                          <p className='mt-1 text-danger'>{errors.ErrorName}</p>
                        }
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-2">
                        <input 
                          type="text" 
                          className="form-control shadow-none" 
                          value={formData.username} 
                          name="username" 
                          id="username" 
                          placeholder="Username" 
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })} 
                        />
                        <label htmlFor="username" className="form-label">Username</label>
                        {errors.ErrorUsername && 
                          <p className='mt-1 text-danger'>{errors.ErrorUsername}</p>
                        }
                      </div>
                    </div>
                    <div className='col-12'>
                      <div className="form-floating">
                        <select className="form-select shadow-none" value={formData.gender} id="floatingSelect" aria-label="Floating label select example" onChange={(e) => setFormData({ ...formData, gender: e.target.value })} >
                          <option selected>Select Gender</option>
                          <option value="male">🧑 Male</option>
                          <option value="female">👩 Female</option>
                        </select>
                        <label htmlFor="floatingSelect">Gender </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-floating mb-2">
                        <input 
                          type={showPass ? 'text' : 'password'} 
                          value={formData.password} 
                          className="form-control shadow-none" 
                          name="password" 
                          id="password"  
                          placeholder="Password" 
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                        />
                        <label htmlFor="password" className="form-label">Password</label>
                        {errors.ErrorPassword && 
                          <p className='mt-1 text-danger'>{errors.ErrorPassword}</p>
                        }
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-check">
                        <input 
                          className="form-check-input" 
                          type="checkbox" 
                          name="remember_me" 
                          id="remember_me" 
                          onChange={(e) => setShowPass(e.target.checked)} 
                        />
                        <label className="form-check-label" htmlFor="remember_me">
                          Show Password
                        </label>
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="d-grid">
                        <button className="btn btn-dark btn-lg" type="submit">SignUp</button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className={`${signupStyle.signup_form_two} mt-4 card`}>
              <div className='text-center card-body'>
                <p>Have an account? <Link to="/login" >Login</Link></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
