import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";

import * as ROUTES from "../../routes";
import { withFirebase } from "../../Firebase";
import "../../styles/signUp.scss";
const SignUpPage = () => (
  <>
    <div className="home-logo-wrap">
      <img className="home-logo" src="/churchbook.png" alt="HomeLogo" />
    </div>
    <div className="sign-up-wrap">
      <div className="sign-up-text-wrap">
        <span className="sign-up-text">회원가입</span>
      </div>
      <SignUpForm />
    </div>
  </>
);

const INITIAL_STATE = {
  username: "",
  email: "",
  passwordOne: "",
  passwordTwo: "",
  error: null
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = () => {
    const { username, email, passwordOne } = this.state;

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        authUser.user.updateProfile({
          displayName: username,
          photoURL: "./defaultProfile.png"
        });
        // Create a user in your Firebase realtime database
        return this.props.firebase.user(authUser.user.uid).set({
          username,
          email,
          photoURL: "./defaultProfile.png"
        });
      })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.CHOOSE_CHURCH);
      })
      .catch(error => {
        this.setState({ error });
      });
  };
  onBack = () => {
    this.props.history.push(ROUTES.HOME);
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { username, email, passwordOne, passwordTwo, error } = this.state;

    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === "" ||
      email === "" ||
      username === "";

    return (
      <div className="input-form-wrap">
        <span className="input-login-text">이름</span>
        <input
          className="input-form"
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="이름 (ex.류동훈)"
        />
        <span className="input-login-text">이메일</span>
        <input
          className="input-form"
          name="email"
          value={email}
          onChange={this.onChange}
          type="text"
          placeholder="xxxx@gmail.com"
        />
        <span className="input-login-text">패스워드</span>
        <input
          className="input-form"
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="기억하기 쉽게"
        />
        <span className="input-login-text">패스워드 확인</span>
        <input
          className="input-form"
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="위와 같게 작성하세요"
        />

        <div
          className="submit-btn-wrap"
          disabled={isInvalid}
          onClick={() => this.onSubmit()}
        >
          <span className="submit-btn">가입하기</span>
        </div>
        {error && <p>{error.message}</p>}
        <div className="back-btn-wrap" onClick={() => this.onBack()}>
          <span className="back-btn">돌아가기</span>
        </div>
      </div>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = withRouter(withFirebase(SignUpFormBase));

export default SignUpPage;

export { SignUpForm, SignUpLink };
