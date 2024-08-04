import { faCirclePlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import StyleImg from "./CreatePost.module.css";
import "./Swal.css";
import { NewPost, UserLogin } from "../../redux-store/Api";
import { useDispatch, useSelector } from "react-redux";
import { SetActivePath } from "../../redux-store/Reducers";
import { toast } from "react-toastify";

export default function CreatePost({ is_check }) {
  const location = useLocation();
  const isActive = useSelector((state) => state.activePath);
  const dispatch = useDispatch();
  const hiddenDivRef = useRef(null);
  const [nameVideo, setNameVideo] = useState(null);
  const token = sessionStorage.getItem("_token");
  const user = useSelector((state) => state.user);

  useEffect(() => {
    if (token) {
      UserLogin(token, dispatch);
    }
    console.log("login=>", user);
  }, []);

  const handleCreatePost = () => {
    Swal.fire({
      title: "Create New Post",
      html: hiddenDivRef.current.innerHTML,
      showCancelButton: true,
      confirmButtonText: "Submit",
      didOpen: () => {
        Swal.getPopup()
          .querySelectorAll("input")
          .forEach((input) => {
            input.addEventListener("input", () =>
              Swal.resetValidationMessage()
            );
          });
      },
      preConfirm: async () => {
        const postTitle = Swal.getPopup().querySelector("#postTitle").value;
        const videoFile =
          Swal.getPopup().querySelector("#file-upload-input").files[0];
        const description = Swal.getPopup().querySelector("#description").value;
        if (!postTitle) {
          Swal.showValidationMessage("Please enter a post title");
          return false;
        }

        if (!videoFile) {
          Swal.showValidationMessage("Please select a video file");
          return false;
        }

        if (videoFile.size > 15 * 1024 * 1024) {
          // 15MB size limit
          Swal.showValidationMessage("Video file size must be less than 15MB");
          return false;
        }

        if (!description) {
          Swal.showValidationMessage("Please enter a post description");
          return false;
        }

        await NewPost({
          title: postTitle,
          description: description,
          video: videoFile,
          user_id: user._id,
        })
          .then((res) => {
            if (res?.status === 200) {
              toast.success("Post Created successfully")
              dispatch({ type: "POSTS", payload: res.data.posts });
              dispatch({ type: "USERS", payload: res.data.users });
              setNameVideo(videoFile.name); 
            }
          })
          .catch((err) => {
            console.log(err);
          });

        return { postTitle, videoFile };
      },
    }).then((result) => {
      if (result.isConfirmed) {
        // const {videoFile } = result.value;
        // console.log("Post Title:", postTitle);
        // console.log("Video File:", videoFile);
        setNameVideo(""); 
      }
    });
  };



  return (
    <>
      <div style={{ display: "none" }}>
        <div ref={hiddenDivRef}>
          <form encType="multipart/form-data">
            <div className="row">
              <div className="mb-4 col-12">
                <div className="card-body">
                  <div>
                    <div className={StyleImg.image_upload_wrap}>
                      <input
                        className={StyleImg.file_upload_input}
                        id="file-upload-input"
                        type="file"
                        accept="video/*"
                        onChange={(e) => setNameVideo(e.target.files[0].name)}
                      />
                      <label
                        htmlFor="file-upload-input"
                        className={StyleImg.drag_text}
                      >
                        <h3>
                          Drag and drop a file or select add Video
                        </h3>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              <div>
              </div>
              <div className="col-12">
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control shadow-none"
                    name="postTitle"
                    id="postTitle"
                    placeholder="Title"
                  />
                  <label htmlFor="postTitle" className="form-label">
                    Title
                  </label>
                </div>
              </div>
              <div className="col-12 form-group text-start">
                <label className="form-label">Description</label>
                <textarea
                  name="description"
                  id="description"
                  className="form-control shadow-none"
                  defaultValue="😎Description🤠🚀✨"
                />
              </div>
            </div>
          </form>
        </div>
      </div>

      {is_check === "pc" && (
        <Link
          className="nav-link text-dark"
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={handleCreatePost}
        >
          <i className="fs-4 me-3">
            <FontAwesomeIcon icon={faCirclePlus} />
          </i>
          New Post
        </Link>
      )}
      {is_check === "mobile" &&(
        <Link
          data-bs-toggle="modal"
          data-bs-target="#exampleModal"
          onClick={() => {
            handleCreatePost()
          }}
          className={"fab-action fab-action-5"}
        >
          <i>
            <FontAwesomeIcon icon={faCirclePlus} />
          </i>
        </Link>
      )}
    </>
  );
}
