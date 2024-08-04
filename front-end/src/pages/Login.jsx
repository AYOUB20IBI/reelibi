import { useEffect, useState } from "react";
import loginStyle from "./Login.module.css";
import { Link, useNavigate } from "react-router-dom";
import { LoginApi } from "../redux-store/Api";
import { useDispatch } from "react-redux";
import logo from "../assets/images/logo/logo.png";
export default function Login() {
  const [isLogin, setIsLogin] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [dataForm, setDataForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    ErrorEmail: "",
    ErrorPassword: "",
    ErrorAll: "",
  });
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const LoginSubmit = async (e) => {
    e.preventDefault();
    setIsLogin(true);
    await LoginApi(dataForm?.email, dataForm?.password)
      .then((res) => {
        if (res?.status === 200) {
          console.log(res.data);
          sessionStorage.setItem("_token", res?.data.token);
          dispatch({ type: "LOGIN", payload: res?.data.user });
          setErrors({
            ErrorAll: res.data.message ? res.data.message : "",
          });

          setIsLogin(false);

          return navigate("/");
        }
      })
      .catch((err) => {
        if (err.response.status === 422) {
          setErrors({
            ErrorEmail: err.response.data.errors.email
              ? err.response.data.errors.email
              : "",
            ErrorPassword: err.response.data.errors.password
              ? err.response.data.errors.password
              : "",
          });
        } else if (err.response.status === 404) {
          setErrors({
            ErrorAll: err.response.data.message
              ? err.response.data.message
              : "",
          });
        }
        setIsLogin(false);
      })
      .finally(setIsLogin(false));
  };
  useEffect(() => {
    document.title = "REELIBI | Login";
  }, []);
  return (
    <>
      <section className="py-3 py-md-5 py-xl-8" style={{ marginTop: "6rem" }}>
        <div className={`${loginStyle.login} container`}>
          <div className="row gy-4 align-items-center justify-content-center">
            <div className="col-12 col-md-6 col-xl-5">
              <div className={`${loginStyle.login_form} card`}>
                <div className="card-body p-3 p-md-4 p-xl-5">
                  <div className="row">
                    <div className="col-12">
                      <div className="mb-4 d-flex align-items-center justify-content-center">
                        {/* <h2 className={`${loginStyle.title}`}>REELIBI</h2> */}
                        <span>
                          <img
                            src={logo}
                            alt=""
                            style={{ width: "200px", height: "100%" }}
                          />
                        </span>
                      </div>
                    </div>
                  </div>
                  <form>
                    <div>
                      {errors?.ErrorAll && (
                        <p className="mt-1 text-danger">{errors?.ErrorAll}</p>
                      )}
                    </div>
                    <div className="row gy-2 overflow-hidden">
                      <div className="col-12">
                        <div className="form-floating mb-2">
                          <input
                            type="email"
                            className="form-control shadow-none"
                            name="email"
                            id="email"
                            placeholder="name@example.com"
                            onChange={(e) =>
                              setDataForm({
                                ...dataForm,
                                email: e.target.value,
                              })
                            }
                          />
                          <label htmlFor="email" className="form-label">
                            Email
                          </label>
                          {errors?.ErrorEmail && (
                            <p className="mt-1 text-danger">
                              {errors?.ErrorEmail}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating mb-2">
                          <input
                            type={showPass ? "text" : "password"}
                            className="form-control shadow-none"
                            name="password"
                            id="password"
                            placeholder="Password"
                            onChange={(e) =>
                              setDataForm({
                                ...dataForm,
                                password: e.target.value,
                              })
                            }
                          />
                          <label htmlFor="password" className="form-label">
                            Password
                          </label>
                          {errors?.ErrorPassword && (
                            <p className="mt-1 text-danger">
                              {errors?.ErrorPassword}
                            </p>
                          )}
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
                          <label
                            className="form-check-label"
                            htmlFor="remember_me"
                          >
                            Show Password
                          </label>
                        </div>
                      </div>

                      <div className="col-12">
                        <div className="d-grid">
                          <button
                            className="btn btn-dark btn-lg"
                            type="submit"
                            onClick={LoginSubmit}
                          >
                            {isLogin ? (
                              <>
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              </>
                            ) : (
                              <span>
                                Login
                              </span>
                            )}
                          </button>
                        </div>
                      </div>
                      <div className="col-12">
                        <p
                          className="text-center"
                          id={loginStyle.forgot_password}
                        >
                          <Link
                            className="text-decoration-none"
                            to={"/forgot/password"}
                          >
                            Forgot Password ?
                          </Link>
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className={`${loginStyle.login_form_two} mt-4 card`}>
                <div className="text-center card-body">
                  <p>
                    Don{"'"}t have an account? <Link to="/signup">Sign up</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
