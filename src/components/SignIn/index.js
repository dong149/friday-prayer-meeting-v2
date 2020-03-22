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
class SignInGoogleBase extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  onSubmit = event => {
    this.props.firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        return this.props.firebase.user(socialAuthUser.user.uid).set({
          username: socialAuthUser.user.displayName,
          email: socialAuthUser.user.email,
          photoURL: socialAuthUser.user.photoURL,
          church: socialAuthUser.user.church
          // photoURL: "./defaultProfile.png"
        });
      })
      .then(() => {
        this.setState({ error: null });
        this.props.history.push(ROUTES.CHOOSE_CHURCH);
      })
      .catch(error => {
        this.setState({ error });
        console.log(error);
      });
    event.preventDefault();
  };

  render() {
    const { error } = this.state;
    return (
      <form onSubmit={this.onSubmit}>
        <div className="login-btn-wrap">
          <div className="google-btn-wrap">
            <button type="submit">
              <img
                className="google-btn"
                src="/google_login-btn.png"
                alt="login-kakao"
              />
            </button>
            {error && <p>{error.message}</p>}
          </div>
        </div>
      </form>
    );
  }
}

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
        this.props.history.push(ROUTES.CHOOSE_CHURCH);
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
        {/* <SignInGoogleBase /> */}
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
const SignInGoogleForm = compose(withRouter, withFirebase)(SignInGoogleBase);
export default SignInPage;
export { SignInForm };
export { SignInGoogleForm };
