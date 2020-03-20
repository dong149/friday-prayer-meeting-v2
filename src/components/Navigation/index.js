import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../routes";
import SignOutButton from "../SignOut";
import { AuthUserContext, withAuthorization } from "../Session";
import "../../styles/navigation.scss";

class Navigation extends Component {
  render() {
    return (
      <div>
        <AuthUserContext.Consumer>
          {authUser => (authUser ? <NavigationAuth /> : <></>)}
        </AuthUserContext.Consumer>
      </div>
    );
  }
}

class NavigationAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: "hide"
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  handleMouseDown(e) {
    this.toggleMenu();
    console.log("clicked");
    e.stopPropagation();
  }
  toggleMenu() {
    if (this.state.visible === "hide") {
      this.setState({
        visible: "show"
      });
    } else {
      this.setState({
        visible: "hide"
      });
    }
  }
  render() {
    const { visible } = this.state;
    return (
      <div>
        <div className="navigation">
          <div className="navigation-logo-wrap">
            <Link to={ROUTES.FEED}>
              <img
                className="navigation-logo"
                src="./churchbook.png"
                alt="logo"
              />
            </Link>
          </div>
          <div className="navigation-menu-icon-wrap">
            <div onMouseDown={this.handleMouseDown}>
              <img
                className="navigation-menu-icon"
                src="./icons8-menu.png"
                alt="menu-icon"
              />
            </div>
          </div>
        </div>
        <div
          id="menu-visible"
          className={visible}
          onMouseDown={this.handleMouseDown}
        >
          <div
            className="menu-visible-header"
            // onMouseDown={this.handleMouseDown}
          >
            <span className="menu-visible-header-text">
              후원 받습니다.
              <br />
              예금주 : 류동훈
              <br />
              010-4288-3243
            </span>
          </div>
          <div className="menu-visible-link-wrap" onMouseDown="">
            {/* <div className="menu-visible-link">
              <Link to={ROUTES.HOME} className="menu-visible-link-text">
                <span className="menu-visible-span">Home</span>
              </Link>
            </div> */}
            <div className="menu-visible-link">
              <Link to={ROUTES.WRITE} className="menu-visible-link-text">
                <span className="menu-visible-span">Write</span>
              </Link>
            </div>
            <div className="menu-visible-link">
              <Link to={ROUTES.FEED} className="menu-visible-link-text">
                <span className="menu-visible-span">Feed</span>
              </Link>
            </div>
            {/* <div className="menu-visible-link">
              <Link to={ROUTES.LANDING} className="menu-visible-link-text">
                <span className="menu-visible-span">Landing</span>
              </Link>
            </div> */}
            <div className="menu-visible-link">
              <Link to={ROUTES.ACCOUNT} className="menu-visible-link-text">
                <span className="menu-visible-span">Account</span>
              </Link>
            </div>
            <div className="menu-visible-link">
              <Link to={ROUTES.ADMIN} className="menu-visible-link-text">
                <span className="menu-visible-span">Admin</span>
              </Link>
            </div>
            <div className="menu-visible-link">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
class NavigationNonAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: "hide"
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }

  handleMouseDown(e) {
    this.toggleMenu();
    console.log("clicked");
    e.stopPropagation();
  }
  toggleMenu() {
    if (this.state.visible === "hide") {
      this.setState({
        visible: "show"
      });
    } else {
      this.setState({
        visible: "hide"
      });
    }
  }
  render() {
    const { visible } = this.state;
    return (
      <div>
        <div className="navigation">
          <div className="navigation-logo-wrap">
            <Link to={ROUTES.FEED}>
              <img
                className="navigation-logo"
                src="./churchbook.png"
                alt="logo"
              />
            </Link>
          </div>
          <div className="navigation-menu-icon-wrap">
            <div onMouseDown={this.handleMouseDown}>
              <img
                className="navigation-menu-icon"
                src="./icons8-menu.png"
                alt="menu-icon"
              />
            </div>
          </div>
        </div>
        <div
          id="menu-visible"
          className={visible}
          onMouseDown={this.handleMouseDown}
        >
          <div
            className="menu-visible-header"
            // onMouseDown={this.handleMouseDown}
          >
            <span className="menu-visible-header-text">
              후원 받습니다.
              <br />
              예금주 : 류동훈
              <br />
              010-4288-3243
            </span>
          </div>
          <div className="menu-visible-link-wrap" onMouseDown="">
            {/* <div className="menu-visible-link">
              <Link to={ROUTES.HOME} className="menu-visible-link-text">
                <span className="menu-visible-span">Home</span>
              </Link>
            </div> */}

            <div className="menu-visible-link">
              <Link to={ROUTES.HOME} className="menu-visible-link-text">
                <span className="menu-visible-span">로그인</span>
              </Link>
            </div>

            <div className="menu-visible-link">
              <Link to={ROUTES.SIGN_UP} className="menu-visible-link-text">
                <span className="menu-visible-span">회원가입</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
// const NavigationNonAuth = withAuthorization(NavigationNonAuthBase);
export default Navigation;
