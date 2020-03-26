import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import * as ROUTES from "../../routes";
import SignOutButton from "../SignOut";
import { AuthUserContext, withAuthorization } from "../Session";
import "../../styles/navigation.scss";
import { withFirebase } from "../../Firebase";
import classnames from "classnames";
class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <AuthUserContext.Consumer>
          {authUser =>
            authUser ? <NavigationAuth firebase={this.props.firebase} /> : <></>
          }
        </AuthUserContext.Consumer>
      </div>
    );
  }
}

class NavigationAuth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: "hide",
      churchImg: "",
      church: "",
      prevScrollpos: window.pageYOffset,
      navbarVisible: "show"
    };
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
  }
  componentDidMount() {
    this.props.firebase
      .userChurch(this.props.firebase.doFindCurrentUID())
      .on("value", snapshot => {
        if (snapshot.val()) {
          this.setState({
            churchImg: `./${snapshot.val()}.png`,
            church: snapshot.val()
          });
        }
      });

    window.addEventListener("scroll", this.handleScroll);
  }
  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleMouseDown() {
    this.toggleMenu();
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

  handleScroll = () => {
    const { prevScrollpos } = this.state;
    const currentScrollPos = window.pageYOffset;
    let visible = "show";
    if (currentScrollPos <= 0) {
      visible = "show";
    } else {
      if (prevScrollpos > currentScrollPos) {
        visible = "hide";
      }
    }

    if (visible === "hide") {
      this.setState({
        prevScrollpos: currentScrollPos,
        navbarVisible: "hide"
      });
    } else {
      this.setState({
        prevScrollpos: currentScrollPos,
        navbarVisible: "show"
      });
    }
  };
  render() {
    const { visible, churchImg, church, navbarVisible } = this.state;

    return (
      <div>
        {/* <div className="test">아아아</div> */}
        <div id="navigation" className={navbarVisible}>
          <div className="navigation-logo-wrap">
            <Link to={ROUTES.FEED}>
              {churchImg ? (
                <img className="navigation-logo" src={churchImg} alt="logo" />
              ) : (
                <img
                  className="navigation-logo"
                  src="./churchbook.png"
                  alt="logo"
                />
              )}
            </Link>
          </div>

          <div className="navigation-menu-icon-wrap">
            <div onClick={() => this.handleMouseDown()}>
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
          onClick={() => this.handleMouseDown()}
        >
          <div
            className="menu-visible-header"
            // onMouseDown={this.handleMouseDown}
          >
            <span className="menu-visible-header-text">
              {/* 피드백 받습니다.
              <br />
              010-4288-3243 */}
            </span>
          </div>
          <div className="menu-visible-link-wrap">
            {church === "ilsanchangdae" ? (
              <div className="menu-visible-link">
                <Link
                  to={ROUTES.FRIDAY_PRAYER}
                  className="menu-visible-link-text"
                >
                  <span className="menu-visible-span">금요기도회</span>
                </Link>
              </div>
            ) : (
              <></>
            )}
            <div className="menu-visible-link">
              <Link to={ROUTES.WRITE} className="menu-visible-link-text">
                <span className="menu-visible-span">글작성하기</span>
              </Link>
            </div>
            <div className="menu-visible-link">
              <Link to={ROUTES.FEED} className="menu-visible-link-text">
                <span className="menu-visible-span">뉴스피드</span>
              </Link>
            </div>
            {/* <div className="menu-visible-link">
              <Link to={ROUTES.LANDING} className="menu-visible-link-text">
                <span className="menu-visible-span">Landing</span>
              </Link>
            </div> */}
            <div className="menu-visible-link">
              <Link to={ROUTES.PROFILE} className="menu-visible-link-text">
                <span className="menu-visible-span">프로필</span>
              </Link>
            </div>
            <div className="menu-visible-link">
              <Link to={ROUTES.ADMIN} className="menu-visible-link-text">
                <span className="menu-visible-span">관리자</span>
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
              피드백 받습니다.
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
