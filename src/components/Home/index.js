import React from "react";
import "../../styles/home.scss";
import { SignInForm } from "../SignIn";
import SignUpPage, { SignUpLink } from "../SignUp/signUpForm";
import { Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";
import * as ROUTES from "../../routes";
const HomePage = () => (
  <div>
    <div className="home-logo-wrap">
      <img
        className="home-logo"
        src="/friday_prayer_meeting.png"
        alt="HomeLogo"
      />
    </div>
    <SignInForm />

    <div className="officialContent-wrap">여기는 공지사항입니다.</div>
  </div>
);

export default HomePage;
