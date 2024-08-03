import {
  faCircleUser,
  faGear,
  faHome,
  faMagnifyingGlass,
  faRightFromBracket,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetActivePath } from "../redux-store/Reducers";
import logo from "../assets/images/logo/logo.png";
import CreatePost from "./../pages/profile/CreatePoste";
export default function SideBar() {
  const isActive = useSelector((state) => state.activePath);
  const dispatch = useDispatch();
  const navigate = useNavigate()

  const LogOut = async ()=>{
    await dispatch({type:"LOGOUT",payload:""})
    return navigate("/login")
  }
  return (
    <>
      <div
        className="d-flex flex-column flex-shrink-0 p-3"
        style={{ height: "100%" }}
      >
        <Link
          onClick={() => {
            dispatch(SetActivePath("home"));
          }}
          to="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none"
        >
          <span className="fs-4">
            <img src={logo} alt="" style={{ width: "100%", height: "100%" }} />
          </span>
        </Link>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link
              to="/"
              onClick={() => {
                dispatch(SetActivePath("home"));
              }}
              className={
                isActive == "home" || location.pathname === "/"
                  ? "nav-link bg-dark text-light"
                  : "nav-link text-dark"
              }
              aria-current="page"
            >
              <i className="fs-4 me-3">
                <FontAwesomeIcon icon={faHome} />
              </i>
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link
              to="/search"
              onClick={() => {
                dispatch(SetActivePath("search"));
              }}
              className={
                isActive == "search" || location.pathname === "/search"
                  ? "nav-link bg-dark text-light"
                  : "nav-link text-dark"
              }
              aria-current="page"
            >
              <i className="fs-4 me-3">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </i>
              Search
            </Link>
          </li>
          <li>
            <Link
              to="/setting"
              onClick={() => {
                dispatch(SetActivePath("setting"));
              }}
              className={
                isActive == "setting" || location.pathname === "/setting"
                  ? "nav-link bg-dark text-light"
                  : "nav-link text-dark"
              }
              aria-current="page"
            >
              <i className="fs-4 me-3">
                <FontAwesomeIcon icon={faGear} />
              </i>
              Settings
            </Link>
          </li>
          <li>
            <Link
              to={`/profile`}
              onClick={() => {
                dispatch(SetActivePath("profile"));
              }}
              className={
                isActive == "profile" || location.pathname === "/profile"
                  ? "nav-link bg-dark text-light"
                  : "nav-link text-dark"
              }
              aria-current="page"
            >
              <i className="fs-4 me-3">
                <FontAwesomeIcon icon={faCircleUser} />
              </i>
              Profile
            </Link>
          </li>
          <li>
            <CreatePost is_check={"pc"} />
          </li>
        </ul>
        <hr />
        <div>
          <button className="btn btn-outline-danger w-100" onClick={LogOut}> <span><FontAwesomeIcon icon={faRightFromBracket}/></span> LogOut</button>
        </div>
      </div>
    </>
  );
}
