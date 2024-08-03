import axios from "axios";
import { toast } from "react-toastify";
const url = import.meta.env.VITE_BACKEND_URL;

export const LoginApi = async (email, password) => {
  return axios.post(`${url}/api/login`, { email, password });
};

export const SignUpApi = async (body) => {
  return axios.post(`${url}/api/signup`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const GetUsers = async () => {
  return axios.get(`${url}/api/users`);
};

export const GetUser = async (id,dispatch) => {
  return axios.get(`${url}/api/user/${id}`).then(res=>{
    if(res?.status === 200){
      dispatch({type:"USER",payload:res.data.user})
      dispatch({type:"ISLOADINGPUSER",payload:false})
    }
  }).catch(err=>{
    console.log(err);
    dispatch({type:"ISLOADINGPUSER",payload:true})
  })
};

export const UserLogin = async (token, dispatch) => {
  await axios
    .get(`${url}/api/user/profile`, {
      headers: { Authorization: token },
    })
    .then((result) => {
      if (result?.status === 200) {
        dispatch({ type: "USERLOGIN", payload: result.data.user });
        dispatch({ type: "ISLOADINGPROFIL", payload: false });
      }
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: "ISLOADINGPROFIL", payload: true });
    });
};

export const NewPost = async (body) => {
  return axios.post(`${url}/api/new/post`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const GetPosts = async (dispatch) => {
  await axios
    .get(`${url}/api/get/posts`)
    .then((res) => {
      if (res?.status === 200) {
        dispatch({ type: "POSTS", payload: res.data.posts });
        dispatch({ type: "ISLOADINGPOSTS", payload: false });
      }
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: "ISLOADINGPOSTS", payload: true });
    });
};

export const GetComment = async (id_post, dispatch) => {
  await axios
    .get(`${url}/api/get/comments/${id_post}`)
    .then((res) => {
      if (res?.status === 200) {
        console.log(res);
        dispatch({ type: "COMMENTS", payload: res.data.comments });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const GetAllComments = async (dispatch) => {
  await axios
    .get(`${url}/api/get/comments`)
    .then((res) => {
      if (res?.status === 200) {
        console.log(res);
        dispatch({ type: "COMMENTS", payload: res.data.comments });
        dispatch({ type: "ISLOADINGCOMMENTS", payload: false });
      }
    })
    .catch((err) => {
      dispatch({ type: "ISLOADINGCOMMENTS", payload: true });
      console.log(err);
    });
};

export const NewComment = async (body, dispatch) => {
  await axios
    .post(`${url}/api/create/comment`, body)
    .then((res) => {
      if (res?.status === 200) {
        toast.success("Comment created successfully");
        console.log(res);
        dispatch({ type: "COMMENTS", payload: res.data.comments });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

export const LikePost = async (body, dispatch) => {
  await axios
    .post(`${url}/api/like/post`, body)
    .then((res) => {
      if (res?.status === 200) {
        toast.success("Like added successfully");
        let payload = {
          postId: body.postId,
          likes: res.data.likes,
        };
        dispatch({ type: "UPDATE_POST_LIKE", payload });
      }
    })
    .catch((err) => {
      console.log(err);
      toast.error("Failed to add like");
    });
};

export const DeleteComment = async (body, dispatch) => {
  await axios
    .post(`${url}/api/delete/comment`, body)
    .then((res) => {
      if (res?.status === 200) {
        toast.success("Comment deleted successfully");
        dispatch({ type: "COMMENTS", payload:res?.data.comments });
      }
    })
    .catch((err) => {
      console.log(err);
      toast.error("Failed to delete Comment");
    });
};


export const EditUser = async (id_user,body) => {
  return axios.put(`${url}/api/edit/profile/${id_user}`, body, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const FollowUser = async (id_user,id_follow, dispatch) => {
  await axios
    .post(`${url}/api/follow/${id_follow}/${id_user}`)
    .then((res) => {
      if (res?.status === 200) {
        toast.success("Followed");
        dispatch({ type: "USERS", payload:res?.data.users });
      }
    })
    .catch((err) => {
      console.log(err);
      toast.error("Failed to follow user");
    });
};


export const UnFollowUser = async (id_user,id_unfollow, dispatch) => {
  await axios
    .post(`${url}/api/unfollow/${id_unfollow}/${id_user}`)
    .then((res) => {
      if (res?.status === 200) {
        toast.success("UnFollowed");
        dispatch({ type: "USERS", payload:res?.data.users });
      }
    })
    .catch((err) => {
      console.log(err);
      toast.error("Failed to unfollow user");
    });
};

export const ChangePassword = async (id_user,body) => {
  return axios.put(`${url}/api/change/password/${id_user}`, body);
};





