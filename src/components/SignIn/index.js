import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import { withFirebase } from "../../Firebase";
import * as ROUTES from "../../routes";
import SignUpPage, { SignUpLink } from "../SignUp/signUpForm";
import { Router, Route } from "react-router-dom";
import { Link } from "react-router-dom";
const SignInPage = () => (
  <div>
    <h1>SignIn</h1>
    <SignInForm />
    <SignUpLink />
  </div>
);

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignInFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        console.log("post check");
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.FEED);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { email, password, error } = this.state;
    const isInvalid = password === "" || email === "";
    return (
      <div>
        <form onSubmit={this.onSubmit} className="input-wrap">
          <p className="input-login-text">Email</p>
          <input
            className="input-login"
            type="text"
            value={email}
            name="email"
            onChange={this.onChange}
            required={true}
          />
          <p className="input-login-text">Password</p>
          <input
            className="input-login"
            type="password"
            value={password}
            name="password"
            onChange={this.onChange}
            required={true}
          />
          <div className="input-submit-wrap">
            <button className="input-submit" disabled={isInvalid} type="submit">
              로그인
            </button>
            {error && <p>{error.message}</p>}
          </div>
        </form>
        <div className="login-btn-wrap">
          <div className="google-btn-wrap">
            <img
              className="google-btn"
              src="/google_login-btn.png"
              alt="login-kakao"
            />
          </div>
          <div className="kakao-btn-wrap">
            <img
              className="kakao-btn"
              src="/kakao_login-btn-large.png"
              alt="login-kakao"
            />
          </div>
        </div>
        <div className="signin-question-wrap">
          <span className="signin-question">
            아직 회원이 아니신가요?
            <Link to={ROUTES.SIGN_UP}>회원가입</Link>
            <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
          </span>
        </div>
      </div>

      // <form onSubmit={this.onSubmit}>
      //   <input
      //     name="email"
      //     value={email}
      //     onChange={this.onChange}
      //     type="text"
      //     placeholder="Email Address"
      //   />
      //   <input
      //     name="password"
      //     value={password}
      //     onChange={this.onChange}
      //     type="password"
      //     placeholder="Password"
      //   />
      //   <button disabled={isInvalid} type="submit">
      //     Sign In
      //   </button>
      //   {error && <p>{error.message}</p>}
      // </form>
    );
  }
}

const SignInForm = compose(withRouter, withFirebase)(SignInFormBase);

export default SignInPage;
export { SignInForm };
