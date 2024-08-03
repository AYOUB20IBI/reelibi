import { useEffect, useState } from "react";
import { ChangePassword, UserLogin } from "../../redux-store/Api";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function ProfilePassword() {
  const [showPass,setShowPass]=useState(false)
  const token = sessionStorage.getItem("_token");
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      UserLogin(token, dispatch);
    }
  }, []);
  const [dataform, setDataForm] = useState({
    new_password: "",
    confirm_password: "",
  });

  const [errors, setErrors] = useState({
    ErrorNew_password: "",
    ErrorConfirm_password: "",
    ErrorAll: "",
  });
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const valeus = {
      new_password:dataform?.new_password,
      confirm_password:dataform?.confirm_password
    }

    try {
      const res = await ChangePassword(user?._id, valeus);
      if (res?.status === 200) {
        dispatch({ type: "USERS", payload: res.data.users });
        dispatch({ type: "LOGIN", payload: res.data.user });
        setErrors({ ErrorAll: res.data.message ? res.data.message : "" });
        toast.success("Password Changed successfully");
        setErrors({
          ErrorNew_password:"",
          ErrorConfirm_password:"",
        });
      }
    } catch (err) {
      if (err.response.status === 422) {
        setErrors({
          ErrorNew_password: err.response.data.errors.new_password || "",
          ErrorConfirm_password:
            err.response.data.errors.confirm_password || "",
        });
      } else if (err.response.status === 404) {
        setErrors({
          ErrorAll: err.response.data.message || "",
        });
      }
    }
  };

  return (
    <>
      <div
        className="tab-pane fade"
        id="password-tab-pane"
        role="tabpanel"
        aria-labelledby="password-tab"
        tabIndex="0"
      >
        <form onSubmit={handleChangePassword}>
          <h5 className="mb-3">Password</h5>
          {errors.ErrorAll && (
            <p className="mt-1 text-danger">{errors.ErrorAll}</p>
          )}
          <div className="row mb-4">
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="profilePassword">
                New Password
              </label>
              <input
                className="form-control shadow-none"
                type={showPass? 'text':'password'}
                id="profilePassword"
                onChange={(e) =>
                  setDataForm({
                    ...dataform,
                    new_password: e.target.value,
                  })
                }
                value={dataform.new_password}
              />
              {errors.ErrorNew_password && (
                <p className="mt-1 text-danger">{errors.ErrorNew_password}</p>
              )}
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label" htmlFor="profileConfirmPassword">
                Confirm Password
              </label>
              <input
                className="form-control shadow-none"
                type={showPass? 'text':'password'}
                id="profileConfirmPassword"
                onChange={(e) =>
                  setDataForm({
                    ...dataform,
                    confirm_password: e.target.value,
                  })
                }
                value={dataform.confirm_password}
              />
              {errors.ErrorConfirm_password && (
                <p className="mt-1 text-danger">
                  {errors.ErrorConfirm_password}
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
              <label className="form-check-label" htmlFor="remember_me">
                Show Password
              </label>
            </div>
          </div>
          <br />
          <div className="d-grid">
            <button className="btn btn-dark" type="submit">
              Update Password
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
