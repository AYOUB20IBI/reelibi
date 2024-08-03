import { useSelector } from "react-redux";
import styleGallery from "./UserGallery.module.css";
import { useEffect, useState } from "react";

export default function UserGallery({ user_id }) {
  const url = import.meta.env.VITE_BACKEND_URL;
  const posts = useSelector((state) => state.posts);
  const [reels,setReels]=useState([])

  useEffect(()=>{
    if(user_id){
        const userPosts = posts.filter((post) => post.user_id === user_id);
        setReels(userPosts)
    }
  },[user_id,posts])

  return (
    <div>
      <div className={styleGallery.gallery}>
        {reels.length > 0 ? (
          reels.map((post, index) => (
            <div className={styleGallery.video_gallery} key={index}>
              <video src={`${url}/posts/${post.video}`} controls></video>
            </div>
          ))
        ) : (
          <h3>No reels</h3>
        )}
      </div>
    </div>
  );
}
