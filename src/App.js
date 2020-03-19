import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import * as ROUTES from "./routes";
import Navigation from "./components/Navigation";
import Join from "./components/join";
import Login from "./components/login";
import SignUpPage from "./components/SignUp/signUpForm";
import SignInPage from "./components/SignIn";
import HomePage from "./components/Home";
import AccountPage from "./components/Account";
import AdminPage from "./components/Admin";
import { withAuthentication } from "./components/Session";
import WriteForm from "./components/Write";
import Feed from "./components/Feed";
import "./styles/main.scss";
const App = () => (
  <Router>
    <div>
      <Navigation />
      <hr />
      <Route exact path={ROUTES.LANDING} component={Join} />
      <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
      <Route exact path={ROUTES.SIGN_IN} component={HomePage} />
      <Route exact path={ROUTES.PASSWORD_FORGET} component={Join} />
      <Route exact path={ROUTES.HOME} component={HomePage} />
      <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
      <Route exact path={ROUTES.ADMIN} component={AdminPage} />
      <Route exact path={ROUTES.WRITE} component={WriteForm} />
      <Route exact path={ROUTES.FEED} component={Feed} />
    </div>
  </Router>
);

export default withAuthentication(App);

// import React from "react";

// import Firebase from "firebase";
// import "firebase/auth";
// import config from "./config";
// import Test from "./pages/test";
// import Home from "./pages/home";
// import Join from "./components/join";
// import Login from "./components/login";

// class App extends React.Component {
//   constructor(props) {
//     super(props);
//     Firebase.initializeApp(config.firebase);
//     this.auth = Firebase.auth();
//   }

//   render() {
//     return (
//       <div>
//         <Login />
//       </div>
//     );
//   }
// }

// export default App;
