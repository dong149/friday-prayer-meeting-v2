import React, { Component } from "react";
import Firebase from "firebase";

class Join extends Component {
  constructor(props) {
    super(props);

    this.state = {
      users: [],
      email: "",
      id: "",
      password: "",
      password2: ""
    };
    // this.state = {
    //   email: "",
    //   id: "",
    //   password: "",
    //   password2: ""
    // };
  }
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
  // 입력값 체크
  handleChangeEmail = event => {
    const email = event.target.value;
    this.setState({ email });
  };
  handleChangeID = event => {
    const id = event.target.value;
    this.setState({ id });
  };
  handleChangePassword = event => {
    const password = event.target.value;
    this.setState({ password });
  };
  handleChangePassword2 = event => {
    const password2 = event.target.value;
    this.setState({ password2 });
  };

  handleCreateUser = event => {
    const { users, email, id, password, password2 } = this.state;
    const payload = { email, id, password, password2 };
    if (password !== password2) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    console.log(`payload value : $(payload)`);
    // const { users } = payload;
    // users.push({ payload });
    users.push(payload);
    Firebase.database()
      .ref("/")
      .set({ users });
    console.log("회원가입 완료");
  };
  render() {
    return (
      <div>
        <h1>회원가입</h1>
        <div className="input-wrap">
          <p className="input-login-text">Email</p>
          <input
            className="input-login"
            type="text"
            name="email"
            onChange={this.handleChangeEmail}
            required={true}
          />
          <p className="input-login-text">ID</p>
          <input
            className="input-login"
            type="text"
            name="id"
            onChange={this.handleChangeID}
            required={true}
          />
          <p className="input-login-text">Password</p>
          <input
            className="input-login"
            type="password"
            name="password"
            onChange={this.handleChangePassword}
            required={true}
          />
          <p className="input-login-text">Password Verify</p>
          <input
            className="input-login"
            type="password"
            name="password2"
            onChange={this.handleChangePassword2}
            required={true}
          />
        </div>
        <div className="input-submit-wrap">
          <button className="input-submit" onClick={this.handleCreateUser}>
            회원가입
          </button>
        </div>
      </div>
    );
  }
}

export default Join;
