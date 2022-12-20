/**
 * JWT.js
 */

import jwt from 'jsonwebtoken'


// <<< HARD-CODED
const JWT_KEY = "7&V#Wbvs6VX78*p9w@If0Ug@ty5GBTWF"
// HARD-CODED >>>


export const jwt_sign = (payload, options, callback) => {
  if (typeof options === "object") {
    // { algorithm,
    //   // OPTIONAL
    //   jwtid:       <can be used to revoke access>,
    //   noTimestamp: <prevents generation of iat (issued at)>
    //   header:      <>,
    //   keyid:       <used to indicate a change of key>,
    //   mutatePayload
    //   // NO DEFAULTS
    //   expiresIn: <millisseconds | "2 days" | "2d" | "10ms",>
    //   notBefore: <as expiresIn>,
    //   audience:  <string or regex>,
    //   issuer:    <string or array of strings>,
    //   subject:   <string?>
    // }
    
    if (typeof callback === "function") {
      return jwt.sign(
        payload,
        JWT_KEY,
        options,
        callback
      )

    } else {
      return jwt.sign(
        payload,
        JWT_KEY,
        options
      )
    }

  } else {
    return jwt.sign(
      payload,
      JWT_KEY
    )
  }
 
}


export const jwt_verify = (token) => {
  try {
    return jwt.verify(token, JWT_KEY)
    
  } catch (error) {
    return { error }
  }
}