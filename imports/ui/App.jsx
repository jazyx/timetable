import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink
} from "react-router-dom";


import { UserProvider } from './contexts/UserContext'
import { TimetableProvider } from './contexts/TimetableContext'


import { Launch }       from './components/Launch.jsx';
import { Home }         from './components/Home.jsx';
import { Login }        from './components/Login/Login.jsx';
import { RequireLogin } from './components/Login/RequireLogin.jsx';
import { Client }       from './components/Client.jsx';
import { School }       from './components/School.jsx';
import { Observer }     from './components/Observer/Observer.jsx';
import { Student }      from './components/Student.jsx';
import { Teacher }      from './components/Teacher/Teacher.jsx';
import { NotFound }     from './components/NotFound.jsx';

export const App = () => {

  return (
    <Router>
      <UserProvider>
        <TimetableProvider>
          <Routes>
            {/* PUBLIC ROUTES */}
            <Route
              path="/"
              element={<Launch />}
            >
              {/* Paths wrapped by Launch go here */}
              {/* Paths that end with /* will ignore extra params */}
              <Route index element={<Home />} />
              <Route path="/login" element={<Login />} />assignment
              <Route path="/not-found/*" element={<NotFound />} />assignment

              {/* PRIVATE ROUTES */}
              <Route
                path="/n/*"
                element={
                  <RequireLogin
                    redirectTo="/login"
                  >
                    <Routes>
                      {/* <Route path="c/:client_id/*" element={<Client />} /> */}
                      <Route path="e/:school_id/*" element={<School />} />

                      <Route path="t/:teacher_name/*" element={<Teacher />} />assignment

                      <Route path="s/:student_id">
                        <Route
                          path=":teacher_id/*"
                          element={<Student />}
                        />
                        <Route
                          path=""
                          element={<Student />}
                        />
                      </Route>assignment

                      <Route path="o/:observer_id">
                        <Route
                          path=":teacher_name/*"
                          element={<Observer />}
                        />
                        <Route
                          path=""
                          element={<Observer />}
                        />
                      </Route>

                      {/*  CATCHALL FOR UNLISTED PATHS */}
                      <Route path="*" element={
                        <Navigate
                          to="/not-found/at-all"
                          replace={true}
                        />} />
                    </Routes>
                  </RequireLogin>
                }
              />
            </Route>

            {/*  CATCHALL FOR UNLISTED PATHS */}
            <Route path="*" element={
              <Navigate
                to="/not-found"
                replace={true}
              />} />
          </Routes>
        </TimetableProvider>
      </UserProvider>
    </Router>
  )
}
