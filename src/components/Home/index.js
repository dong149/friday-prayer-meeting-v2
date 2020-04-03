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
          <div className="google-login-inform-wrap">
            <span className="google-login-inform">
              ※Chrome, Safari에서만 로그인 가능합니다.
            </span>
          </div>
          {/* <SignInFacebookForm /> */}

          {/* <div className="officialContent-wrap">여기는 공지사항입니다.</div> */}
          <div className="footer">
            <div className="footer-intro-wrap">
              <span className="footer-intro">
                ※코로나로 교제가 힘들어진 요즘. 각 교회의 성도분들이 소통하기를
                바라는 마음으로 개발하였습니다.
                <br />
                아직 테스트 단계이며, 피드백과 의견은 언제나 환영합니다.
              </span>
            </div>
            <div className="footer-company-name-wrap">
              <span className="footer-company-name">(주)왼손잡이들</span>
            </div>

            <div className="footer-company-description-wrap">
              <span className="footer-company-description">
                피드백 및 문의 donghoon149@gmail.com
                <br />
                사업자등록번호 : 156-28-00781 | 대표 : 류동훈
                <br />
                서울 강남구 테헤란로 311 아남타워 6,7층
              </span>
            </div>
          </div>
        </div>
      )
    }
  </AuthUserContext.Consumer>
);

export default HomePage;
