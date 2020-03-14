import React, { Component } from "react";
import { withAuthorization, AuthUserContext } from "../Session";

class AdminPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      users: []
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.users().on("value", snapshot => {
      const usersObject = snapshot.val();
      const usersList = Object.keys(usersObject).map(key => ({
        ...usersObject[key],
        uid: key
      }));
      this.setState({
        users: usersList,
        loading: false
      });
    });
  }
  componentWillUnmount() {
    this.props.firebase.users().off();
  }
  render() {
    const { users, loading } = this.state;
    return (
      <div>
        <h1>Admin</h1>
        {loading && <div>Loading ...</div>}
        <AuthUserContext.Consumer>
          {authUser =>
            authUser.email === "donghoon149@gmail.com" ? (
              <UserList users={users} />
            ) : (
              <h2>관리자 권한이 없습니다.</h2>
            )
          }
        </AuthUserContext.Consumer>
      </div>
    );
  }
}
const UserList = ({ users }) => (
  <ul>
    {users.map(user => (
      <li key={user.uid}>
        <span>
          <strong>ID:</strong> {user.uid}
        </span>
        <span>
          <strong>E-Mail:</strong> {user.email}
        </span>
        <span>
          <strong>Username:</strong> {user.username}
        </span>
      </li>
    ))}
  </ul>
);
// const condition = authUser =>
//   !!authUser && authUser.email === "donghoon149@gmail.com";
const condition = authUser => !!authUser;
export default withAuthorization(condition)(AdminPage);
