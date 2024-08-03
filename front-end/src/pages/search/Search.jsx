import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import styleSearchUsers from "./SearchUsers.module.css";
import LoadingComments from "../../components/loading/LoadingComments";
import { useEffect } from "react";

const url = import.meta.env.VITE_BACKEND_URL;

export default function Search() {
  const data = useSelector((state) => state.data);
  const result = useSelector((state) => state.filteredData);
  const isLoadingSearch = useSelector((state) => state.isLoadingSearch);
  const currentUser = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const SearchByName = (name) => {
    dispatch({ type: "ISLOADINGPSEARCH", payload: true });
    if (data) {
      const res = data.filter(
        (item) =>
          item.name.toLowerCase().includes(name.toLowerCase()) &&
          item._id !== currentUser._id
      );
      dispatch({ type: "DISPLAY", payload: res });
      dispatch({ type: "ISLOADINGPSEARCH", payload: false });
    }
  };

  useEffect(() => {
    document.title = "REELIBI | Search";
  }, []);

  const token = sessionStorage.getItem("_token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      dispatch({ type: "LOGOUT", payload: "" });
      return navigate("/login");
    }
  }, [token, dispatch, navigate]);

  return (
    <>
      <section className="row px-4" style={{ marginTop: "3rem" }}>
        <div className="col-12">
          <div className="input-group mb-3">
            <span className="input-group-text bg-dark text-light">
              <i className="fs-4">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </i>
            </span>
            <div className="form-floating">
              <input
                type="text"
                className="form-control shadow-none"
                id="floatingInputGroup1"
                placeholder="Search"
                onChange={(e) => SearchByName(e.target.value)}
              />
              <label htmlFor="floatingInputGroup1">Search</label>
            </div>
          </div>
          <hr />
          <div className="row">
            {isLoadingSearch ? (
              <LoadingComments />
            ) : (
              <div>
                <ul className={`p-0 ${styleSearchUsers.list_users}`}>
                  {result.length === 0 ? (
                    <li className="text-center text-muted">No results</li>
                  ) : (
                    result.map((item, index) => (
                      <Link
                        className="text-decoration-none"
                        to={`/profile/${item._id}/user`}
                        key={index}
                      >
                        <li>
                          <div className={styleSearchUsers.searchUser}>
                            <img
                              src={`${url}/uploads/${item.image}`}
                              alt=""
                              className={`${styleSearchUsers.image_user} me-3`}
                            />
                            <h3 className={`fs-5 text-capitalize`}>{item.name}</h3>
                          </div>
                        </li>
                      </Link>
                    ))
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
