import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import LoginFirebase from "./components/loginFirebase";
import * as ROUTES from "./routes";
import Navigation from "./components/navigation";
import Home from "./pages/home";
import Join from "./components/join";
import Login from "./components/login";
import { SignUpForm } from "./components/signUpForm";
class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Navigation />
          <Route exact path={ROUTES.LANDING} component={Join} />
          <Route path={ROUTES.SIGN_UP} component={SignUpForm} />
          <Route path={ROUTES.SIGN_IN} component={SignUpForm} />
          <Route path={ROUTES.PASSWORD_FORGET} component={Join} />
          <Route path={ROUTES.HOME} component={Home} />
          <Route path={ROUTES.ACCOUNT} component={Home} />
          {/* <Route path={ROUTES.ADMIN} component={LoginFirebase} /> */}
        </div>
      </Router>
    );
  }
}

export default App;

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
