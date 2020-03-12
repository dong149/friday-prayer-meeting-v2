import React, { Component } from "react";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase/app";
// import "firebase/auth";
// import config from "../config";
import logo from "../logo.svg";
import "../App.css";
import Firebase from "../Firebase/config";

// const Firebase = firebase.initializeApp(config);

class LoginFirebase extends Component {
  render() {
    const { user, signOut, signInWithGoogle } = this.props;
    console.log(user);
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          {user ? <p>Hello, {user.displayName}</p> : <p>Please sign in.</p>}

          {user ? (
            <button onClick={signOut}>Sign out</button>
          ) : (
            <div>
              <button onClick={signInWithGoogle}>Sign in with Google</button>
            </div>
          )}
        </header>
      </div>
    );
  }
}

const firebaseAppAuth = Firebase.auth;

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider()
};

// HOC 이다.
export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(LoginFirebase);

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
