const initialState = {
  data: [],
  posts: [],
  comments: [],
  filteredData: [],
  displayUser: {},
  activePath: sessionStorage.getItem("currentPage") || "/home",
  user: {},
  isLogin: false,
  isLoadingPosts: false,
  isLoadingProfil: false,
  isLoadingComments: false,
  isLoadingUser: false,
  isLoadingSearch: false,
};

export default function AppReducer(state = initialState, action) {
  switch (action.type) {
    case "DISPLAY":
      return {
        ...state,
        filteredData:action.payload,
      };
    case "SHOWUSER":
      return {
        ...state,
        displayUser: state.data.find(
          (user) => user.id === Number(action.payload)
        ),
      };
    case "SET_ACTIVE_PATH":
      sessionStorage.setItem("currentPage", action.payload);
      return {
        ...state,
        activePath: action.payload,
      };
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        isLogin: true,
      };
    case "USERS":
      return {
        ...state,
        data: action.payload,
      };
    case "USER":
      return {
        ...state,
        displayUser: action.payload,
      };
    case "USERLOGIN":
      return {
        ...state,
        user: action.payload,
        isLogin: true,
      };
    case "POSTS":
      return {
        ...state,
        posts: action.payload
      };
    case "ISLOADINGPOSTS":
      return {
        ...state,
        isLoadingPosts: action.payload,
      };
    case "ISLOADINGCOMMENTS":
      return {
        ...state,
        isLoadingComments: action.payload,
      };
    case "ISLOADINGPROFIL":
      return {
        ...state,
        isLoadingProfil: action.payload,
      };
    case "ISLOADINGPUSER":
      return {
        ...state,
        isLoadingUser: action.payload,
      };
    case "ISLOADINGPSEARCH":
      return {
        ...state,
        isLoadingSearch: action.payload,
      };
    case "COMMENTS":
      return {
        ...state,
        comments: action.payload,
      };
    case "UPDATE_POST_LIKE":
      return {
        ...state,
        posts: state.posts.map((post) =>
          post._id === action.payload.postId
            ? { ...post, like: action.payload.likes }
            : post
        ),
      };
    case "LOGOUT":
      sessionStorage.clear();
      localStorage.clear();
      return {
        ...state,
        user: {},
        isLogin: false,
      };
    default:
      return state;
  }
}

export const ShowUser = (id) => {
  return { type: "SHOWUSER", payload: id };
};

export const SetActivePath = (path) => ({
  type: "SET_ACTIVE_PATH",
  payload: path,
});
