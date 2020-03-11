import React from "react";

import Firebase from "firebase";
import config from "./config";
import Test from "./pages/test";
import Home from "./pages/home";
import Join from "./components/join";
import Login from "./components/login";

class App extends React.Component {
  constructor(props) {
    super(props);
    Firebase.initializeApp(config.firebase);
  }

  render() {
    return (
      <div>
        <Login />
      </div>
    );
  }
}

export default App;
