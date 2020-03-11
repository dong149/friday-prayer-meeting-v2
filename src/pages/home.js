import React from "react";
import Login from "../components/login";
import "../styles/home.scss";
const Home = () => {
  return (
    <div>
      <div className="home-logo-wrap">
        <img
          className="home-logo"
          src="/friday_prayer_meeting.png"
          alt="HomeLogo"
        />
      </div>
      <Login />
      <div className="officialContent-wrap">여기는 공지사항입니다.</div>
    </div>
  );
};

export default Home;
