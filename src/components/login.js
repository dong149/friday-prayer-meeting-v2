import React, { Component } from "react";
import Firebase from "firebase";

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      id: "",
      password: ""
    };
  }
  //users데이터를 모두 가져옵니다.
  componentDidMount() {
    const userRef = Firebase.database().ref("users");
    userRef.on("value", snapshot => {
      let users = snapshot.val();
      let newState = [];
      for (let user in users) {
        newState.push({
          email: users[user].email,
          id: users[user].id,
          password: users[user].password,
          password2: users[user].password2
        });
      }
      this.setState({
        users: newState
      });
    });
  }
  handleChangeID = event => {
    const id = event.target.value;
    this.setState({ id });
  };
  handleChangePassword = event => {
    const password = event.target.value;
    this.setState({ password });
  };
  handleLogin = () => {
    const { users, id, password } = this.state;

    for (let user in users) {
      // 기존 user 들의 정보들과 일치하는 것이 존재할 때,
      if (users[user].id === id && users[user].password === password) {
        alert("로그인 성공!");
        return;
      }
    }
    alert("로그인 정보가 옳지 않습니다.");
  };
  render() {
    console.log(process.env.REACT_APP_API_KEY);
    return (
      <div>
        <div className="input-wrap">
          <p className="input-login-text">ID</p>
          <input
            className="input-login"
            type="text"
            name="title"
            onChange={this.handleChangeID}
            required={true}
          />
          <p className="input-login-text">Password</p>
          <input
            className="input-login"
            type="text"
            name="author"
            onChange={this.handleChangePassword}
            required={true}
          />
        </div>
        <div className="input-submit-wrap">
          <button className="input-submit" onClick={this.handleLogin}>
            로그인
          </button>
        </div>
        <div className="login-wrap">
          <img
            className="login-kakao"
            src="/kakao_login-btn-large.png"
            alt="login-kakao"
          />
        </div>
      </div>
    );
  }
}

export default Login;
