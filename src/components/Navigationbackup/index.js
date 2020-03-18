import React from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../routes";
import SignOutButton from "../SignOut";
import { AuthUserContext } from "../Session";
import "../../styles/navigation.scss";

const Navigation = () => (
  <div>
    <AuthUserContext.Consumer>
      {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
    </AuthUserContext.Consumer>
  </div>
);
const NavigationAuth = () => (
  <div>
    <div className="navigation">
      <div className="navigation-logo-wrap">
        <img className="navigation-logo" src="./churchbook.png" alt="logo" />
      </div>
      <div className="navigation-menu-icon-wrap">
        <img
          className="navigation-menu-icon"
          src="./icons8-menu.png"
          alt="menu-icon"
        />
      </div>
    </div>
    <div className="menu">
      <ul>
        <li>
          <Link to={ROUTES.HOME}>Home</Link>
        </li>
        <li>
          <Link to={ROUTES.WRITE}>글작성하기</Link>
        </li>
        <li>
          <Link to={ROUTES.FEED}>뉴스피드</Link>
        </li>
        <li>
          <Link to={ROUTES.LANDING}>Landing</Link>
        </li>
        <li>
          <Link to={ROUTES.ACCOUNT}>Account</Link>
        </li>
        <li>
          <Link to={ROUTES.ADMIN}>Admin</Link>
        </li>
        <li>
          <SignOutButton />
        </li>
      </ul>
    </div>
  </div>
);

const NavigationNonAuth = () => (
  <div>
    <div className="navigation">
      <div className="navigation-logo-wrap">
        <img className="navigation-logo" src="./churchbook.png" alt="logo" />
      </div>
      <div className="navigation-menu-icon-wrap">
        <img
          className="navigation-menu-icon"
          src="./icons8-menu.png"
          alt="menu-icon"
        />
      </div>
    </div>
    <ul>
      <li>
        <Link to={ROUTES.HOME}>Home</Link>
      </li>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
    </ul>
  </div>
);

export default Navigation;
