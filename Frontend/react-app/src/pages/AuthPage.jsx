import { useState } from "react";
import SignUp from "./SignUP";
import LogIn from "./LogIn";

const AuthPage=()=>{
 const [isSignUp,setSignUp]=useState(true);
 const [isLogin,setLogin]=useState(false);

 return(
    <>
        {isLogin ? (
         <LogIn  setLogin={setLogin}   setSignUp={setSignUp} />
        ):null}

        {isSignUp ?(
            <SignUp  setSignUp={setSignUp}  setLogin={setLogin} />
        ):null}

    </>
 )
}

export default AuthPage;