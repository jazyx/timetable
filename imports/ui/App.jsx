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
import { Confirm }       from './components/Login/Confirm.jsx';
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
              <Route path="/login" element={<Login />} />
              <Route path="/confirm/:token" element={<Confirm />} />
              <Route path="/not-found/*" element={<NotFound />} />

              {/* PRIVATE ROUTES */}
              <Route
                path="/n/*"
                element={
                  <RequireLogin
                    redirectTo="/login"
                  >
                    <Routes>
                      <Route
                        path="school/:school_id/*"
                        element={<School />}
                      />

                      <Route
                        path="teacher/:teacher_name/*"
                        element={<Teacher />}
                      />

                      <Route
                        path="student/:student_id">
                        <Route
                          path=":teacher_id/*"
                          element={<Student />}
                        />
                        <Route
                          path=""
                          element={<Student />}
                        />
                      </Route>

                      <Route
                        path="observer/:observer_id">
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
                      <Route
                        path="*" element={
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
