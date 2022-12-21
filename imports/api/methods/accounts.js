import {
  Teacher,
  School
} from '../collections/'



export const createAccount = (user) => {
  // _id:      <id string>,
  // name:     <string>,
  // email:    <string email>,
  // password: <string hash>,
  // role:     <"teacher" | "school">

  const { _id, name, role } = user

  switch (role) {
    case "teacher":
      return createTeacher( _id, name )
    case "school":
      return createSchool( _id, name )
    default:
      return { error: `Unknown role: ${role}` }
  }
}



const createTeacher = ( _id, name ) => {
  // <<< HARD-CODED defaults
  const rate = 1500
  const language = "en-GB"
  const day_begin = new Date()
  day_begin.setHours(8, 0, 0)
  const day_end = new Date()
  day_end.setHours(19, 0, 0)
  // HARD-CODED >>>

  const profile = {
    _id,
    name,
    language,
    rate,
    day_begin,
    day_end,
    unavailable: [],
    inconvenient: []
  }

  const result = Teacher.insert(profile)
  console.log("createTeacher result:", result);
  
  return result
}



const createSchool = ( _id, name ) => {
  const profile = {
    _id,
    name,
    address: "",
    phone_number: "",
    url: "",
    staff: [],
    outstanding_pay: 0,
    outstanding_invoices: 0
  }

  const result = School.insert(profile)
  console.log("createSchool result:", result);
  
  return result
}