
import { useDispatch } from 'react-redux';
import { routes } from './route/index';
import { RouterProvider } from "react-router-dom";
import { useEffect } from 'react';
import { GetUsers } from './redux-store/Api';
import 'react-loading-skeleton/dist/skeleton.css'
export default function App() {
  const dispatch = useDispatch()

  const fetchUsers = async()=>{
    await GetUsers().then(res=>{
      if(res?.status === 200){
        console.log(res.data);
        dispatch({type:"USERS",payload:res.data.users})
      }
    }).catch(err=>{
      console.log(err);
    })
  }
  useEffect(()=>{
    fetchUsers()
  },[])
  return (
    <>
    <RouterProvider router={routes}/>
    </>
  )
}
