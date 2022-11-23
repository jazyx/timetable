import React, { useContext } from 'react';
import { Outlet } from "react-router-dom";

import { Throbber } from './Throbber'
import { NavBar } from './NavBar'
import { TimetableContext } from '../contexts/TimetableContext'


export const Launch = () => {
  const { ready } = useContext(TimetableContext)

  if (!ready) {
    return <Throbber />
  }

  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};
