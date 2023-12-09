import { useState, useEffect } from "react";
import axios from "axios";

import { Icon } from "react-icons-kit";
import { check } from "react-icons-kit/iconic/check";
import { arrow_right } from "react-icons-kit/ikons/arrow_right";
import { InfinitySpin } from "react-loader-spinner";

import Navbar from "../Navbar/Navbar";
import Items from "./Item";

import "./Home.css";
import { useNavigate } from "react-router-dom";
import ItemWindow from "./ItemWindow";

// require("dotenv").config();

const Home = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const [createProfile, setCreateProfile] = useState(true);
  const [uiSimTagItems, setUiSimTagItems] = useState([]);
  const [showItemWindow, setShowItemWindow] = useState(false);
  const [item, setItem] = useState({});

  // useEffect(()=>{
  //   console.log(uiSimTagItems);
  // }, [uiSimTagItems]);

  useEffect(() => {
    const isAuthenticated = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          process.env.REACT_APP_SERVER_URL + "/home",
          {
            withCredentials: true,
          }
        );
        if (res.data.noToken || res.data.tokenInvalid) {
          console.log(res.data.message);
          navigate("/");
        } else {
          setUsername(res.data.username);
          if(res.data.alreadyExists)
            setCreateProfile(false);
            setUiSimTagItems(res.data.ui_sim_tag_items);
          setLoading(false);
        }
      } catch (err) {
        alert("Some error occurred! Please try after some time!");
        console.log("Some error occurred! Please try after some time!", err);
      }
    };
    isAuthenticated();
  }, [navigate]);

  const options = [
    "electronic",
    "fashion",
    "music",
    "sports",
    "gym",
    "android",
    "ios",
    "supplement",
  ];
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    console.log(selectedOptions);
  }, [selectedOptions]);

  const handleSelect = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(
        selectedOptions.filter((selectedOption) => selectedOption !== option)
      );
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSubmit = async () => {
    if (selectedOptions.length === 0) {
      setError(true);
      return;
    }
    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:3001/user-profile",
        {
          // userId: userId,
          profileTags: selectedOptions,
        },
        {
          withCredentials: true,
        }
      );
        setLoading(false);
        setCreateProfile(false);
        setUiSimTagItems(res.data.ui_sim_tag_items);

    } catch (err) {
      alert("Some error occurred! Please try after some time!");
      console.error("Some error occurred! Please try after some time!", err);
      setLoading(false);
    }
  };


  const handleItemWindow=(value, item)=>{
    console.log("handling item window!");
    setShowItemWindow(value);
    setItem(item);
  }

  useEffect(()=>{
    console.log("showItemWindow toggle value: ", showItemWindow);
  }, [showItemWindow]);

  return (
    <>
      <Navbar />
      {loading && (
        <div className="loader">
          <div style={{ color: "white" }}>
            {
              <InfinitySpin
                width="200"
                color="white"
                border="1px solid white"
                margin="0"
              />
            }
            <br />
          </div>
        </div>
      )}
      <div className="home" style={{ position: "relative" }}>
        <h1>Hi {username}!</h1>
        <br />
        <div className="home-con">
          {/* PROFILE CREATION CONTAINER*/}
        { createProfile && <div className="profile-creation-con">
            <h4 style={{ margin: "0 0 1% 0" }}>
                Help us know something more about you!
            </h4>
            {error && selectedOptions.length === 0 && (
                <div className="error">**Must select atleast one!</div>
            )}
            <div>
                {options.map((option) => {
                return (
                    <div
                    key={option}
                    className="profile-option"
                    onClick={() => {
                        handleSelect(option);
                    }}
                    >
                    {option}
                    {selectedOptions.includes(option) && (
                        <Icon
                        style={{
                            position: "absolute",
                            top: "6px",
                            right: "10px",
                            cursor: "pointer",
                            color: "grey",
                        }}
                        icon={check}
                        size={20}
                        //   onClick={() => setShowPassword(!showPassword)}
                        />
                    )}
                    </div>
                );
                })}
                <Icon
                className="profile-option"
                style={{
                    border: "none",
                    display: "flex",
                    alignItems: "center",
                    color: "grey",
                }}
                icon={arrow_right}
                size={60}
                onClick={() => handleSubmit()}
                />
            </div>
            </div>}
        { 
            !createProfile 
            && !showItemWindow 
            &&
            <Items uiSimTagItems={uiSimTagItems} handleItemWindow={handleItemWindow} />

        }
        {
          showItemWindow && 
          <ItemWindow item={item} handleItemWindow={handleItemWindow} showItemWindow={showItemWindow}/>
        }

        </div>
      </div>
    </>
  );
};

export default Home;
