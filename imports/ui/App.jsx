import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  NavLink
} from "react-router-dom";


import { TimetableProvider } from './contexts/TimetableContext'


import { Launch }   from './components/Launch.jsx';
import { Home }     from './components/Home.jsx';
import { Company }  from './components/Company.jsx';
import { School }   from './components/School.jsx';
import { Observer } from './components/Observer/Observer.jsx';
import { Student }  from './components/Student.jsx';
import { Teacher }  from './components/Teacher/Teacher.jsx';
import { NotFound } from './components/NotFound.jsx';

export const App = () => {

  return (
    <Router>
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
            <Route path="c/:company_id/*" element={<Company />} />
            <Route path="e/:school_id/*" element={<School />} />

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

            <Route path="s/:student_id">
              <Route
                path=":teacher_id/*"
                element={<Student />}
              />
              <Route
                path=""
                element={<Student />}
              />
            </Route>

            <Route path="t/:teacher_name/*" element={<Teacher />} />

            <Route path="/not-found/*" element={<NotFound />} />     
          </Route>

          {/*  CATCHALL FOR UNLISTED PATHS */}
          <Route path="*" element={
            <Navigate
              to="/not-found"
              replace={true}
            />} />
        </Routes>
      </TimetableProvider>
    </Router>
  )
}
