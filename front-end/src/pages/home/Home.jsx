import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  FollowUser,
  GetAllComments,
  GetPosts,
  LikePost,
  UnFollowUser,
  UserLogin,
} from "../../redux-store/Api";
import Comments from "../../components/Comments";
import styleHome from "./Home.module.css";
import img2 from "../../assets/images/img2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faHeart, faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingVideo from "../../components/loading/LoadingVideo";
import Swal from "sweetalert2";

const url = import.meta.env.VITE_BACKEND_URL;

const Home = () => {
  const [likedPosts, setLikedPosts] = useState([]);
  const [currentVideo, setCurrentVideo] = useState(null);

  const handleVideoClick = (event) => {
    const video = event.target;
    if (currentVideo && currentVideo !== video) {
      currentVideo.pause();
    }
    if (video.paused) {
      video.play();
      setCurrentVideo(video);
    } else {
      video.pause();
      setCurrentVideo(null);
    }
  };

  const posts = useSelector((state) => state.posts);
  const users = useSelector((state) => state.data);
  const dispatch = useDispatch();
  useEffect(()=>{
    document.title = "REELIBI | Home"
  },[])

  useEffect(() => {
    if (dispatch) {
      GetPosts(dispatch);
    }
  }, [dispatch]);

  useEffect(() => {
    if (dispatch) {
      GetAllComments(dispatch);
    }
  }, [dispatch]);

  const token = sessionStorage.getItem("_token");
  const userlogin = useSelector((state) => state.user);
  const isLoadingPosts = useSelector((state) => state.isLoadingPosts);

  useEffect(() => {
    if (token) {
      UserLogin(token, dispatch);
    }
  }, [userlogin, token, dispatch]);

  const handleLike = async (id_post) => {
    let body = {
      postId: id_post,
      userId: userlogin._id,
    };
    try {
      await LikePost(body, dispatch);
      if (likedPosts.includes(id_post)) {
        setLikedPosts(likedPosts.filter((id) => id !== id_post));
      } else {
        setLikedPosts([...likedPosts, id_post]);
      }
    } catch (error) {
      toast.error("Failed to update like");
    }
  };

  const handleFollow = async (id_follow) => {
    if (userlogin && id_follow) {
      await FollowUser(userlogin?._id, id_follow, dispatch);
    }
  };

  const handleUnFollow = async (id_unfollow) => {
    if (userlogin && id_unfollow) {
      await UnFollowUser(userlogin?._id, id_unfollow, dispatch);
    }
  };

  const navigate = useNavigate()

  useEffect(()=>{
    if (!token) {
      dispatch({type:"LOGOUT",payload:""})
      return navigate("/login")
    }
  },[token,dispatch,navigate])


  const HandleError = ()=>{
    Swal.fire({
      title:"Error",
      icon:"info"
    })
  }



  return (
    <section className={styleHome.home}>
      {isLoadingPosts || posts.length === 0 ? (
        <>
          <LoadingVideo />
        </>
      ) : (
        <div className={styleHome.app_vedio}>
          {posts.map((post, index) => {
            const res = users.find((item) => item._id === post.user_id);
            const isLiked = likedPosts.includes(post._id);
            const following = res?.followers.includes(userlogin._id);
            console.log("foolowing ==>",following);
            return (
              <div className={styleHome.vedio} key={index}>
                <video
                  src={`${url}/posts/${post.video}`}
                  className={styleHome.vedio_player}
                  onClick={handleVideoClick}
                  loop={true}
                ></video>
                <div className={styleHome.footer}>
                  <div className={`${styleHome.like} mb-4`}>
                    <div className="mb-2">
                      <input
                        type="checkbox"
                        id={`like_heart_${post._id}`}
                        onChange={() => handleLike(post._id)}
                        className="d-none"
                        checked={isLiked}
                      />
                      <label
                        htmlFor={`like_heart_${post._id}`}
                        className={isLiked ? "text-danger" : "text-light"}
                      >
                        <FontAwesomeIcon icon={faHeart} />
                        <p className={styleHome.count_like}>{post?.like}</p>
                      </label>
                    </div>
                    <div>
                      <Comments id_post={post?._id} id_user={userlogin._id} />
                    </div>
                    <div className="mb-2" style={{marginLeft:"10px"}}>
                      <label
                        className={"text-light"}
                        onClick={HandleError}
                      >
                        <FontAwesomeIcon icon={faEllipsisVertical} />
                      </label>
                    </div>
                  </div>
                  <div className="footer-text">
                    <div className={styleHome.img_marq}>
                      <Link
                        className="text-light text-decoration-none d-flex align-items-center"
                        to={`/profile/${res?._id}/user`}
                      >
                        <img src={`${url}/uploads/${res?.image}`} alt="img" />
                        <h3
                          className="me-3 text-lowercase"
                          style={{ fontSize: "18px" }}
                        >
                          {res?.name}
                        </h3>
                      </Link>
                      {following ? (
                        <button
                          onClick={() => handleUnFollow(res._id)}
                          className="btn btn-outline-light btn-sm"
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFollow(res._id)}
                          className="btn btn-outline-light btn-sm"
                        >
                          Follow
                        </button>
                      )}
                    </div>

                    <div>
                      <div className="row">
                        <div className="col-11">
                          <div className={styleHome.reels_music}>
                            <span>{post?.title}</span>
                          </div>
                          <div className={styleHome.reels_desc}>
                            <p>{post?.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <br />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};

export default Home;
