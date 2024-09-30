import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import "./LoginPopup.css";

const LoginPopup = ({ setShowLogin }) => {
    const [currState, setCurrState] = useState("Login");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async () => {
        try {
            let res;
            if (currState === "Sign Up") {
                res = await axios.post(
                    "https://foodie-green.vercel.app/api/auth/register",
                    { name, email, password },
                    { withCredentials: true } 
                );
                console.log(res.data.message);
                setEmail('')
                setPassword('')
                setName('')
                setCurrState('Login')
            } else {
                res = await axios.post(
                    "https://foodie-green.vercel.app/api/auth/login",
                    { email, password },
                    { withCredentials: true }
                );
                console.log(res.data.message);
                setShowLogin(false);
                navigate('/'); 
            }
        } catch (error) {
            console.log(error.response ? error.response.data.message : 'An error occurred');
        }
    };

    return (
        <div className="login-popup">
            <div className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2>
                    <img
                        onClick={() => setShowLogin(false)}
                        src={assets.cross_icon} 
                        alt="Close"
                        style={{ cursor: 'pointer' }}
                    />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && (
                        <input
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    )}
                    <input
                        type="email"
                        placeholder="Your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button onClick={handleSubmit}>
                    {currState === "Login" ? "Login" : "Create account"}
                </button>
                {currState === "Login" ? (
                    <p>
                        Create a new account?{" "}
                        <span onClick={() => setCurrState("Sign Up")}>Click here</span>
                    </p>
                ) : (
                    <p>
                        Already have an account?{" "}
                        <span onClick={() => setCurrState("Login")}>Login here</span>
                    </p>
                )}
            </div>
        </div>
    );
};

export default LoginPopup;
