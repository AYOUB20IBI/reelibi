
import { Outlet, useNavigate } from 'react-router-dom';
import SideBar from './components/SideBar';
import styles from './Layout.module.css';
import Navigation from './components/btn_navigation/Navigation';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function Layout() {
  const token = sessionStorage.getItem("_token");
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(()=>{
    if (!token) {
      dispatch({type:"LOGOUT",payload:""})
      return navigate("/login")
    }
  },[token,dispatch,navigate])
  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <SideBar />
      </div>
      <div className={styles.content}>
        <Outlet />
      </div>
      <Navigation/>
    </div>
  );
}
