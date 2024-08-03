import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  FollowUser,
  GetUser,
  UnFollowUser,
  UserLogin,
} from "../../redux-store/Api";
import LoadingProfil from "../../components/loading/LoadingProfil";
import UserGallery from "../../components/UserGallery";
import { useNavigate, useParams } from "react-router-dom";

export default function UsersProfile() {
  const url = import.meta.env.VITE_BACKEND_URL;
  const token = sessionStorage.getItem("_token");
  const userlogin = useSelector((state) => state.user);
  const { id } = useParams();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.displayUser);
  const isLoadingUser = useSelector((state) => state.isLoadingUser);

  useEffect(() => {
    if (token) {
      UserLogin(token, dispatch);
    }
  }, [userlogin, token, dispatch]);

  const handleFollow = async () => {
    if (userlogin && id) {
      await FollowUser(userlogin?._id, id, dispatch);
    }
  };

  const handleUnFollow = async () => {
    if (userlogin && id) {
      await UnFollowUser(userlogin?._id, id, dispatch);
    }
  };

  const isFollowing = user?.followers?.includes(userlogin?._id);
  useEffect(() => {
    if (id) {
      GetUser(id, dispatch);
    }
  }, [id, dispatch, user]);

  useEffect(() => {
    document.title = `REELIBI | ${userlogin?.name}`;
  }, [userlogin]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      dispatch({ type: "LOGOUT", payload: "" });
      return navigate("/login");
    }
  }, [token, dispatch, navigate]);

  return (
    <>
      {isLoadingUser ? (
        <>
          <LoadingProfil />
        </>
      ) : (
        <section className="py-3 py-md-5 py-xl-8">
          <div className="container">
            <div className="row gy-4 gy-lg-0">
              <div className="col-12 col-lg-4 col-xl-3">
                <div className="row gy-4">
                  <div className="col-12">
                    <div className="card widget-card border-light shadow-sm">
                      <div className="card-header text-bg-dark">
                        {user?.name}
                      </div>
                      <div className="card-body">
                        <div className="text-center mb-3">
                          <img
                            src={`${url}/uploads/${user?.image}`}
                            className="img-fluid rounded-circle"
                            alt="Luna John"
                            style={{
                              width: "100px",
                              height: "100px",
                              border: "3px solid",
                            }}
                          />
                        </div>
                        <h5 className="text-center mb-1">{user?.name}</h5>
                        <ul className="list-group list-group-flush mb-4">
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            <h6 className="m-0">Followers</h6>
                            <span>{user?.followers?.length}</span>
                          </li>
                          <li className="list-group-item d-flex justify-content-between align-items-center">
                            <h6 className="m-0">Following</h6>
                            <span>{user?.following?.length}</span>
                          </li>
                        </ul>
                        <div className="d-grid m-0">
                          {isFollowing ? (
                            <button
                              onClick={() => handleUnFollow()}
                              className="btn btn-outline-dark"
                            >
                              Unfollow
                            </button>
                          ) : (
                            <button
                              onClick={() => handleFollow()}
                              className="btn btn-outline-dark"
                            >
                              Follow
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="card widget-card border-light shadow-sm">
                      <div className="card-header text-bg-dark">
                        Developed By
                      </div>
                      <div className="card-body">
                        <span className="text-muted fw-bold text-center">
                          IBIDARNE AYOUB
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-12 col-lg-8 col-xl-9">
                <div className="card widget-card border-light shadow-sm">
                  <div className="card-body p-4">
                    <ul className="nav nav-tabs" id="profileTab" role="tablist">
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link active text-dark"
                          id="overview-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#overview-tab-pane"
                          type="button"
                          role="tab"
                          aria-controls="overview-tab-pane"
                          aria-selected="true"
                        >
                          Overview
                        </button>
                      </li>
                      <li className="nav-item" role="presentation">
                        <button
                          className="nav-link text-dark"
                          id="email-tab"
                          data-bs-toggle="tab"
                          data-bs-target="#email-tab-pane"
                          type="button"
                          role="tab"
                          aria-controls="email-tab-pane"
                          aria-selected="false"
                        >
                          Posts
                        </button>
                      </li>
                    </ul>
                    <div className="tab-content pt-4" id="profileTabContent">
                      <div
                        className="tab-pane fade show active"
                        id="overview-tab-pane"
                        role="tabpanel"
                        aria-labelledby="overview-tab"
                        tabIndex="0"
                      >
                        <h5 className="mb-3">About</h5>
                        <p className="lead mb-3 fs-6">{user?.bio}</p>
                        <h5 className="mb-3">Profile</h5>
                        <div className="row g-0">
                          <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                            <div className="p-2">Full Name</div>
                          </div>
                          <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                            <div className="p-2">{user?.name}</div>
                          </div>
                          <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                            <div className="p-2">Email</div>
                          </div>
                          <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                            <div className="p-2">{user?.email}</div>
                          </div>
                          <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                            <div className="p-2">Gender</div>
                          </div>
                          <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                            <div className="p-2">
                              {user?.gender === "male" ? (
                                <>🧑 {user?.gender}</>
                              ) : (
                                <>👩 {user?.gender}</>
                              )}
                            </div>
                          </div>
                          <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                            <div className="p-2">Username</div>
                          </div>
                          <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                            <div className="p-2 text-lowercase">
                              {user?.username}
                            </div>
                          </div>
                          <div className="col-5 col-md-3 bg-light border-bottom border-white border-3">
                            <div className="p-2">Status</div>
                          </div>
                          <div className="col-7 col-md-9 bg-light border-start border-bottom border-white border-3">
                            <div className="p-2">
                              <span className="badge text-bg-success">
                                Active
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="tab-pane fade"
                        id="email-tab-pane"
                        role="tabpanel"
                        aria-labelledby="email-tab"
                        tabIndex="0"
                      >
                        <div className="container overflow-hidden">
                          <div className="row gy-4 gy-md-5 gx-xl-6 gy-xl-6 gx-xxl-9 gy-xxl-9">
                            <UserGallery user_id={user?._id} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
