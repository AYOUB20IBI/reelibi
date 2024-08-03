import { Link, useLocation } from "react-router-dom";
import "./Navigation.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faGear,
  faHouse,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetActivePath } from "../../redux-store/Reducers";
import CreatePost from "./../../pages/profile/CreatePoste";

export default function Navigation() {
  const location = useLocation();
  const isActive = useSelector((state) => state.activePath);
  const dispatch = useDispatch();
  useEffect(() => {
    const handleClickOutside = (event) => {
      const fabCheckbox = document.getElementById("fabCheckbox");
      if (fabCheckbox && !fabCheckbox.contains(event.target)) {
        fabCheckbox.checked = false;
      }
    };

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <>
      <div className="fab_wrapper">
        <input id="fabCheckbox" type="checkbox" className="fab-checkbox" />
        <label className="fab" htmlFor="fabCheckbox">
          <span className="fab-dots-menu">
            <FontAwesomeIcon icon={faBars} />
          </span>
          <span className="fab-dots fab-dots-1"></span>
          <span className="fab-dots fab-dots-2"></span>
          <span className="fab-dots fab-dots-3"></span>
        </label>
        <div className="fab-wheel">
          <Link
            onClick={() => {
              dispatch(SetActivePath("home"));
            }}
            to="/"
            className={
              isActive == "home" || location.pathname === "/"
                ? "fab-action fab-action-1 isActive"
                : "fab-action fab-action-1"
            }
          >
            <i>
              <FontAwesomeIcon icon={faHouse} />
            </i>
          </Link>
          <Link
            to="/search"
            onClick={() => {
              dispatch(SetActivePath("search"));
            }}
            className={
              isActive == "search" || location.pathname === "/search"
                ? "fab-action fab-action-2 isActive"
                : "fab-action fab-action-2"
            }
          >
            <i>
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </i>
          </Link>
          <Link
            to="/setting"
            onClick={() => {
              dispatch(SetActivePath("setting"));
            }}
            className={
              isActive == "setting" || location.pathname === "/setting"
                ? "fab-action fab-action-3 isActive"
                : "fab-action fab-action-3"
            }
          >
            <i>
              <FontAwesomeIcon icon={faGear} />
            </i>
          </Link>
          <Link
            to="/profile"
            onClick={() => {
              dispatch(SetActivePath("profile"));
            }}
            className={
              isActive == "profile" || location.pathname === "/profile"
                ? "fab-action fab-action-4 isActive"
                : "fab-action fab-action-4"
            }
          >
            <i>
              <FontAwesomeIcon icon={faUser} />
            </i>
          </Link>
          <CreatePost is_check={"mobile"}/>
        </div>
      </div>
    </>
  );
}
