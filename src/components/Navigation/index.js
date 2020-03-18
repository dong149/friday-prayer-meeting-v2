import React, { Component } from "react";
import { Link } from "react-router-dom";
import * as ROUTES from "../../routes";
import SignOutButton from "../SignOut";
import { AuthUserContext } from "../Session";
import "../../styles/navigation.scss";

class Navigation extends Component {
  render() {
    return (
      <div>
        <AuthUserContext.Consumer>
          {authUser => (authUser ? <NavigationAuth /> : <NavigationNonAuth />)}
        </AuthUserContext.Consumer>
      </div>
    );
  }
}

class NavigationAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
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
    this.setState({
      visible: !this.state.visible
    });
  }
  render() {
    const { visible } = this.state;
    return (
      <div>
        <div className="navigation">
          <div className="navigation-logo-wrap">
            <img
              className="navigation-logo"
              src="./churchbook.png"
              alt="logo"
            />
          </div>
          <div className="navigation-menu-icon-wrap">
            <div onMouseDown={this.props.handleMouseDown}>
              <img
                className="navigation-menu-icon"
                src="./icons8-menu.png"
                alt="menu-icon"
              />
            </div>
          </div>
        </div>
        {!visible ? (
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
        ) : (
          <div className="menu-visible">
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
        )}
      </div>
    );
  }
}
class NavigationNonAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }
  toggleMenu() {
    this.setState({
      visible: !this.state.visible
    });
  }
  render() {
    return (
      <div>
        <div className="navigation">
          <div className="navigation-logo-wrap">
            <img
              className="navigation-logo"
              src="./churchbook.png"
              alt="logo"
            />
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
  }
}

export default Navigation;
