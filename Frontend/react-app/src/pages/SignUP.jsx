import SignUpFrom from "../components/SignUpForm";
import ParticlesBackground from "../components/ParticlesBackground";
import "../css/Basis.css";


const SignUp=({setSignUp,setLogin})=>{
    return(
        <>
            <ParticlesBackground/>
           <SignUpFrom setSignUp={setSignUp}  setLogin={setLogin}/>

        </>
    )
}


export default SignUp;