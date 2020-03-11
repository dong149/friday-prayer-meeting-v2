import React, { Component } from "react";
import withFirebaseAuth from "react-with-firebase-auth";
import * as firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./config";
import logo from "./logo.svg";
import "./App.css";
import Home from "./pages/home";

const firebaseApp = firebase.initializeApp(firebaseConfig);

class App extends Component {
  render() {
    const { user, signOut, signInWithGoogle } = this.props;

    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          {user ? <p>Hello, {user.displayName}</p> : <p>Please sign in.</p>}

          {user ? (
            <button onClick={signOut}>Sign out</button>
          ) : (
            <button onClick={signInWithGoogle}>Sign in with Google</button>
          )}
          <Home />
        </header>
      </div>
    );
  }
}

const firebaseAppAuth = firebaseApp.auth();

const providers = {
  googleProvider: new firebase.auth.GoogleAuthProvider()
};

export default withFirebaseAuth({
  providers,
  firebaseAppAuth
})(App);

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
