import React from "react";
import "../../styles/home.scss";
import { SignInForm, SignInGoogleForm, SignInFacebookForm } from "../SignIn";
import SignUpPage, { SignUpLink } from "../SignUp/signUpForm";
import { Router, Route, Redirect } from "react-router-dom";
import { Link } from "react-router-dom";
import * as ROUTES from "../../routes";
import { AuthUserContext } from "../Session";
const HomePage = () => (
  <AuthUserContext.Consumer>
    {authUser =>
      authUser ? (
        <Redirect to={ROUTES.FEED} />
      ) : (
        <div>
          <div className="home-logo-wrap">
            <img className="home-logo" src="/churchbook.png" alt="HomeLogo" />
          </div>
          <SignInForm />
          <SignInGoogleForm />
          {/* <SignInFacebookForm /> */}

          {/* <div className="officialContent-wrap">여기는 공지사항입니다.</div> */}
        </div>
      )
    }
  </AuthUserContext.Consumer>
);

export default HomePage;
