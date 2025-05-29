import React, { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { Navigate } from 'react-router-dom'
import { logout } from '../store/userSlice'

function LogOut() {
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(logout())
  }, [dispatch])

  return <Navigate to="/" />
}

export default LogOut