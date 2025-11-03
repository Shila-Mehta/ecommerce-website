import LogInForm from "../components/LogInForm";
import ParticlesBackground from "../components/ParticlesBackground";
import "../css/Basis.css";



const LogIn=({setLogin  ,setSignUp})=>{
    return(
        <>
        <ParticlesBackground/>
         <LogInForm  setLogin={setLogin}     setSignUp={setSignUp} />

        </>
    )
}


export default LogIn;