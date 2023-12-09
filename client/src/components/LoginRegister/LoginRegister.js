import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import Navbar from "../Navbar/Navbar";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";
import { spinner9 } from "react-icons-kit/icomoon/spinner9";

import "./LoginRegister.css";

const LoginRegister = () => {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    alreadyExists: false,
    wrongCombination: false,
    incorrectCredentials: false,
    doesNotExist: false,
  });

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        const res = await axios.get(
          process.env.REACT_APP_SERVER_URL + "/login",
          {
            withCredentials: true,
          }
        );
        if (res.data.noToken || res.data.tokenInvalid) {
          console.log(res.data.message);
        } else {
          console.log('navigating to home!');
          navigate("/home");
        }
      } catch {
        console.log("Some error occurred!");
      }
    };
    isAuthenticated();
  }, [navigate]);

  const handleLogin = async () => {
    if (username.length === 0 || password.length === 0) {
      setError(true);
      setErrors({ errors, incorrectCredentials: true });
      return;
    }
    setLoading(true);
    const res = await axios.post(
      "http://localhost:3001/login",
      {
        username: username,
        password: password,
      },
      {
        withCredentials: true,
      }
    );
    setLoading(false);
    if(res.data.doesNotExist){  
      setErrors({ errors, doesNotExist: true });
      setTimeout(()=>{
        setErrors({...errors, doesNotExist: false});
      }, 5000);
    }
    else if(res.data.wrongCombination){  
      setErrors({ errors, wrongCombination: true });
      setTimeout(()=>{
        setErrors({...errors, wrongCombination: false});
      }, 5000);
    }
    else {
      console.log("Logged in successfully!");
      navigate("/home");
    }
  };

  const handleRegister = async () => {
    if (username.length === 0) {
      setError(true);
      setErrors({ ...errors, incorrectCredentials: true });
      return;
    }
    var regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:,<.>/?]).{8,}$/;
    if (!regex.test(password)) {
      setError(true);
      setErrors({ ...errors, incorrectCredentials: true });
      return;
    }
    setLoading(true);
    try{
      const res = await axios.post(
        "http://localhost:3001/register",
        {
          username: username,
          password: password,
        },
        {
          withCredentials: true,
        }
      );
      setLoading(false);
      // setError(res.data.errorStatus);
      if (res.data.errorStatus) {
        setErrors({ ...errors, alreadyExists: true });
        setTimeout(() => {
          setErrors({ ...errors, alreadyExists: false });
        }, 5000);
      }
      else{
        navigate("/home");
        console.log("User registration successful!");       
      }
      // alert("USER REGISTRATION SUCCESSFUL!");
    }catch(err){
      alert("User Registration Failure due to unknown error! Please try after some time!");
      console.error("User Registration Failure! Please try after some time!");
    }
  };

  return (
    <>
      <Navbar />
      <div className="log-reg">
        <div className="log-reg-con">
          <div className="con-border">
            <h1 style={{ margin: "0 0 0 0" }}>
              {showLogin ? "SIGN IN:" : "SIGN UP:"}
            </h1>
            <input
              placeholder="username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
              }}
            />
            {!showLogin &&
              errors.incorrectCredentials &&
              username.length === 0 && (
                <span className="error">Username is required!</span>
              )}
            <div style={{ position: "relative", alignContent: "center" }}>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                style={{
                  height: "40px",
                  width: "100%",
                  boxSizing: "border-box",
                }}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
              <Icon
                style={{
                  position: "absolute",
                  top: "6px",
                  right: "10px",
                  cursor: "pointer",
                }}
                icon={showPassword ? eyeOff : eye}
                size={20}
                onClick={() => setShowPassword(!showPassword)}
              />
            </div>
            {!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()-_=+{};:,<.>/?]).{8,}$/.test(
              password
            ) &&
              !showLogin &&
              errors.incorrectCredentials && (
                <span className="error">
                  Password is required!
                  <br />
                  **Min 8, atleast 1 num, 1 upper, 1 lower, 1 special char
                </span>
              )}
            {showLogin &&
              errors.incorrectCredentials &&
              (username.length === 0 || password.length === 0) && (
                <span className="error">
                  Username and password cannot be empty!
                </span>
              )}
            {!showLogin && errors.alreadyExists && (
              <span className="error">User already exists!</span>
            )}
            {showLogin && errors.wrongCombination && (
              <span className="error">Wrong username/password combination!</span>
            )}
            {
              showLogin && errors.doesNotExist && (
                <span className="error">User doesn't exist!</span>
              )
            }
            <button
              onClick={() => {
                showLogin ? handleLogin() : handleRegister();
              }}
              style={{ position: "relative" }}
            >
              {" "}
              {showLogin ? "SIGN IN" : "SIGN UP"}{" "}
              {loading && (
                <Icon
                  style={{
                    position: "absolute",
                    top: "8px",
                    right: "10px",
                    animation: "spin 2s linear infinite",
                  }}
                  icon={spinner9}
                  size={20}
                />
              )}
            </button>
            <div style={{ textAlign: "center" }}>
              {showLogin ? "New user? " : "Already a user? "}
              <span
                style={{ textDecoration: "underline", cursor: "pointer" }}
                onClick={() => {
                  setShowLogin(!showLogin);
                  setErrors({
                    ...errors,
                    incorrectCredentials: false,
                    alreadyExists: false,
                    wrongCombination: false,
                    doesNotExist: false,
                  });
                  setUsername("");
                  setPassword("");
                }}
              >
                {showLogin ? "Register" : "Login"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginRegister;
