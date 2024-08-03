import { toast } from "react-toastify";
import { EditUser, UserLogin } from "../../redux-store/Api";
import styleUserSetting from "./UserSettings.module.css";
import { useDispatch, useSelector } from "react-redux";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const url = import.meta.env.VITE_BACKEND_URL
export default function UserSettings() {
  const token = sessionStorage.getItem("_token");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      UserLogin(token, dispatch);
    }
  }, []);
  const [formData, setFormData] = useState({
    email: user?.email,
    username: user?.username,
    name: user?.name,
    gender:user?.gender,
    bio:user?.bio
  });

  const [errors, setErrors] = useState({
    ErrorEmail: "",
    ErrorUsername: "",
    ErrorName: "",
    ErrorBio:"",
    ErrorGender:"",
    ErrorsAll: "",
  });

  const [picture, setPicture] = useState(null);



  const SittingSubmit = async (e) => {
    e.preventDefault();

    const inputData = new FormData();
    inputData.append("email", formData.email);
    inputData.append("username", formData.username);
    inputData.append("name", formData.name);
    inputData.append("bio", formData.bio);
    inputData.append("gender", formData.gender);
    if (picture) {
      inputData.append("avatar", picture);
    }

    try {
      const res = await EditUser(user?._id,inputData);
      if (res?.status === 200) {
        dispatch({ type: "USERS", payload: res.data.users });
        dispatch({ type: "LOGIN", payload: res.data.user });
        setErrors({ ErrorAll: res.data.message ? res.data.message : "" });
        toast.success("God Job");
      }
    } catch (err) {
      if (err.response.status === 422) {
        setErrors({
          ErrorEmail: err.response.data.errors.email || "",
          ErrorUsername: err.response.data.errors.username || "",
          ErrorName: err.response.data.errors.name || "",
          ErrorGender: err.response.data.errors.gender || "",
          ErrorBio: err.response.data.errors.bio || "",
        });
      } else if (err.response.status === 404) {
        setErrors({
          ErrorAll: err.response.data.message || "",
        });
      }
    }
  };

  const PhotoHandle = (e) => {
    setPicture(e.target.files[0]);
  };

  useEffect(()=>{
    document.title = "REELIBI | Settings"
  },[])

  const navigate = useNavigate()

  useEffect(()=>{
    if (!token) {
      dispatch({type:"LOGOUT",payload:""})
      return navigate("/login")
    }
  },[token,dispatch,navigate])
  return (
    <>
      <div className="row mt-3">
        <div className="col-xl-12 col-sm-12 grid-margin stretch-card">
          <div>
            <div className={`${styleUserSetting.card_body}`}>
              <h3 className="text-center text-uppercase">Update Profile</h3>
              <div className="row">
                <div className="d-flex align-items-start align-items-sm-center gap-4">
                  <div className="flex-shrink-0 mt-n2 mx-sm-0 mx-auto">
                    <div
                      className="avatar avatar-xl mb-2"
                      id={styleUserSetting.avatar}
                    >
                      <img
                        className="avatar-img rounded-circle border border-2 border-white"
                        src={picture ? URL.createObjectURL(picture) :`${url}/uploads/${user?.image}`}
                        style={{ width: "100%", height: "100%" }}
                        alt=""
                      />
                    </div>
                  </div>
                  <div className="button-wrapper">
                    <label htmlFor="image" className="btn btn-dark me-2 mb-4">
                      <span className="d-none d-sm-block">
                        Upload new photo
                      </span>
                      <i className="bx bx-upload d-block d-sm-none"></i>
                    </label>

                    <p className="text-muted mb-0">
                      Allowed JPG, GIF or PNG. Max size of 800K
                    </p>
                  </div>
                </div>
              </div>
              <hr />
              {errors.ErrorAll && (
                <p className="mt-1 text-danger">{errors.ErrorAll}</p>
              )}
              <div>
                <form
                  className={`${styleUserSetting.FormInputSetting}`}
                  encType="multipart/form-data"
                  onSubmit={SittingSubmit}
                >
                  <input
                    type="file"
                    id="image"
                    name="avatar"
                    onChange={PhotoHandle}
                    className="d-none"
                  />
                  <div className="row">
                    <div className="col-12 row p-0 m-0">
                      <div className="col-12 col-md-6">
                        <div className="form-floating mb-2">
                          <input
                            type="email"
                            className="form-control shadow-none"
                            name="email"
                            id="email"
                            placeholder="name@example.com"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                email: e.target.value,
                              })
                            }
                            value={formData.email}
                          />
                          <label htmlFor="email" className="form-label">
                            Email
                          </label>
                          {errors.ErrorEmail && (
                            <p className="mt-1 text-danger">
                              {errors.ErrorEmail}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-floating mb-2">
                          <input
                            type="text"
                            className="form-control shadow-none"
                            name="fullname"
                            id="fullname"
                            placeholder="Full Name"
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            value={formData.name}
                          />
                          <label htmlFor="fullname" className="form-label">
                            Full Name
                          </label>
                          {errors.ErrorName && (
                            <p className="mt-1 text-danger">
                              {errors.ErrorName}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="col-12 row p-0 m-0">
                      <div className="col-12 col-md-6">
                        <div className="form-floating mb-2">
                          <input
                            type="text"
                            className="form-control shadow-none"
                            name="username"
                            id="username"
                            placeholder="Username"
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                username: e.target.value,
                              })
                            }
                            value={formData.username}
                          />
                          <label htmlFor="username" className="form-label">
                            Username
                          </label>
                          {errors.ErrorUsername && (
                            <p className="mt-1 text-danger">
                              {errors.ErrorUsername}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12 col-md-6">
                        <div className="form-floating mb-2">
                          <select className="form-select shadow-none" value={formData.gender} id="floatingSelect" aria-label="Floating label select example" onChange={(e) => setFormData({ ...formData, gender: e.target.value })} >
                            <option selected>Select Gender</option>
                            <option value="male">🧑 Male</option>
                            <option value="female">👩 Female</option>
                          </select>
                          <label htmlFor="floatingSelect">Gender </label>
                        </div>
                        {errors.ErrorGender && (
                            <p className="mt-1 text-danger">
                              {errors.ErrorGender}
                            </p>
                          )}
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-group">
                        <label className="form-label">Bio</label>
                        <textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} name="bio" id="bio" className="form-control shadow-none">
                        </textarea>
                      </div>
                      {errors.ErrorBio && (
                            <p className="mt-1 text-danger">
                              {errors.ErrorBio}
                            </p>
                          )}
                    </div>
                    <div className="col-12 mt-4">
                      <div className="d-grid">
                        <button className="btn btn-dark btn-lg" type="submit">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
