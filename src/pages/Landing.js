import React, { useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import '../styles/Landing.css'
import { useNavigate } from "react-router-dom";
import { auth, db, googleProvider } from '../Firebase';
import { signInWithPopup } from "firebase/auth";
import { Timestamp, doc, getDoc, setDoc } from "firebase/firestore";

function Landing() {

    const navigate = useNavigate();

    useEffect(() => {
        if(auth.currentUser) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const loginWithGoogle = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const loggedInUser = result.user;
            // add user to firebase
            const userRef = doc(db, "users", loggedInUser.uid);
            const userSnap = await getDoc(userRef);
            if(!userSnap.exists()) {
                await setDoc(userRef, {
                    name: loggedInUser.displayName,
                    email: loggedInUser.email,
                    lastLogin: Timestamp.now(),
                    reportCount: 0,
                    lastReport: null
                });
            }
            navigate("/dashboard");
        } catch (error) {
            console.log("Error logging in with google: ", error);
        }
    }

    return (
        <div className="main-container">
            <h1 className="header">Welcome to <span>Rivals</span></h1>
            <div className="sub-container">
                <p className="subheader">Enter the ultimate battleground where heroes and villains report each other</p>
                <button className="login-button" onClick={loginWithGoogle}><FcGoogle className="google-icon"/>Continue with Google</button>
            </div>
            {/* <p className="subheader">Enter the ultimate battleground where heroes and villains report each other</p>
            <button className="login-button" onClick={loginWithGoogle}><FcGoogle className="google-icon"/>Continue with Google</button> */}
        </div>
    )
}

export default Landing;