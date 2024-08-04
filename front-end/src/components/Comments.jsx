import { faComment, faSquarePen } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { formatDistanceToNow } from "date-fns";
import { toast } from "react-toastify";
import styleHome from "../pages/home/Home.module.css";
import styleComment from "./Comments.module.css";
import { DeleteComment, NewComment } from "../redux-store/Api";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";

const url = import.meta.env.VITE_BACKEND_URL;
import LoadingComments from "./loading/LoadingComments";

export default function Comments({ id_post, id_user }) {
  const [isComment, setIsComment] = useState(false);
  const [isDComment, setIsDComment] = useState(false);
  const comments = useSelector((state) => state.comments);
  const isLoadingComments = useSelector((state) => state.isLoadingComments);
  const users = useSelector((state) => state.data);
  const [dataComment, setDataComment] = useState([]);
  const [textComment, setTextComment] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    const data = comments.filter((item) => item.post_id === id_post);
    setDataComment(data);
  }, [id_post, comments]);

  function formatTimeAgo(timestamp) {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
  }
  const handleCreateComment = async () => {
    setIsComment(true);
    if (textComment.trim() === "") {
      toast.error("Comment cannot be empty");
      setIsComment(false);
      return;
    }

    const data = {
      post_id: id_post,
      user_id: id_user,
      comment: textComment,
    };

    try {
      await NewComment(data, dispatch);
      setTextComment("");
      setIsComment(false);
    } catch (error) {
      toast.error("Failed to add comment");
      setIsComment(false);
    } finally {
      setIsComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setIsDComment(true);
    const data = {
      comment_id: commentId,
      post_id: id_post,
    };

    try {
      await DeleteComment(data, dispatch);
      setIsDComment(false);
    } catch (error) {
      toast.error("Failed to add comment");
      setIsDComment(false);
    } finally {
      setIsDComment(false);
    }
  };

  return (
    <>
      <label
        htmlFor="partage"
        className="text-light"
        data-bs-toggle="modal"
        data-bs-target={`#commentsModal-${id_post}`}
      >
        <FontAwesomeIcon icon={faComment} />
        <p className={styleHome.count_like}>{dataComment.length}</p>
      </label>
      <div
        className="modal fade fs-6"
        id={`commentsModal-${id_post}`}
        tabIndex="-1"
        aria-labelledby={`commentsModalLabel-${id_post}`}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered text-dark">
          <div className="modal-content">
            <div className="modal-header">
              <h1
                className="modal-title fs-5"
                id={`commentsModalLabel-${id_post}`}
              >
                Comments ({dataComment.length})
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="container">
                <div className="row d-flex justify-content-center">
                  <div className="col-12">
                    <div className="headings d-flex justify-content-between align-items-center mb-3 border">
                      <div className="input-group">
                        <textarea
                          className="form-control shadow-none"
                          value={textComment}
                          onChange={(e) => setTextComment(e.target.value)}
                          aria-label="With textarea"
                          placeholder="Comment ..."
                        ></textarea>
                        <span
                          className="input-group-text bg-dark text-light"
                          onClick={handleCreateComment}
                          style={{cursor:"pointer"}}
                        >
                          {isComment ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm"
                                role="status"
                                aria-hidden="true"
                              ></span>
                            </>
                          ) : (
                            <FontAwesomeIcon icon={faSquarePen} />
                          )}
                        </span>
                      </div>
                    </div>
                    {isLoadingComments ? (
                      <>
                        <LoadingComments />
                      </>
                    ) : (
                      <>
                        {dataComment.map((item, index) => {
                          const user = users.find(
                            (user) => user._id === item.user_id
                          );
                          return (
                            <div
                              className={`${styleComment.card} p-3`}
                              key={index}
                            >
                              <div className="d-flex justify-content-between align-items-center">
                                <div className="user d-flex flex-row align-items-center">
                                  <img
                                    src={`${url}/uploads/${user?.image}`}
                                    width="30"
                                    className={`${styleComment.user_img} rounded-circle mr-2 me-3`}
                                    alt="User"
                                  />
                                  <span>
                                    <small className="font-weight-bold text-primary text-lowercase">
                                      @{user?.name}
                                    </small>
                                  </span>
                                </div>
                              </div>
                              <hr className="mt-2 w-100 p-0" />
                              <div>
                                <span className="d-flex justify-content-start">
                                  <small className="font-weight-bold">
                                    {item.comment}
                                  </small>
                                </span>
                              </div>
                              <div className="d-flex justify-content-between align-items-center mt-3">
                                <div className="user d-flex flex-row align-items-center">
                                  {id_user === user._id && (
                                    <span
                                      className="mr-2 me-3 "
                                      onClick={() =>
                                        handleDeleteComment(item._id)
                                      }
                                    >
                                      {isDComment ? (
                                        <>
                                          <span
                                            className="spinner-border spinner-border-sm"
                                            role="status"
                                            aria-hidden="true"
                                          ></span>
                                        </>
                                      ) : (
                                        <span style={{cursor:"pointer"}}>
                                          <FontAwesomeIcon icon={faTrashCan} />
                                        </span>
                                      )}
                                    </span>
                                  )}
                                </div>

                                <small className="fs-6">
                                  {formatTimeAgo(item.date)}
                                </small>
                              </div>
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
