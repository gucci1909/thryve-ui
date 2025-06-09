import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { logout } from '../store/userSlice'
import { useCookies } from 'react-cookie';

function LogOut() {
  const dispatch = useDispatch();
  const [cookies, setCookie, removeCookie] = useCookies(['token']);
  
  useEffect(() => {
      removeCookie("authToken", { path: "/" });
    dispatch(logout())
  }, [dispatch])

  return <Navigate to="/" />
}

export default LogOut