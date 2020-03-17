import React, { Component } from "react";
import * as ROUTES from "../../routes";
import { withAuthorization, AuthUserContext } from "../Session";
import "../../styles/feed.scss";
class FeedBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      contents: []
    };
  }
  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.contents().on("value", snapshot => {
      const contentsObject = snapshot.val();
      const contentsList = Object.keys(contentsObject).map(key => ({
        ...contentsObject[key],
        uid: key
      }));
      this.setState({
        contents: contentsList,
        loading: false
      });
    });
  }
  componentWillUnmount() {
    this.props.firebase.contents().off();
  }

  render() {
    const { contents, loading } = this.state;
    return (
      <div className="feed">
        {loading && <div>Loading ...</div>}
        <AuthUserContext.Consumer>
          {authUser => <ContentList contents={contents} />}
        </AuthUserContext.Consumer>
      </div>
    );
  }
}
const ContentList = ({ contents }) =>
  contents.map(content => (
    <div className="content-wrap" key={content.date}>
      <div className="content-body-wrap">
        <div className="content-header">
          <div className="content-profile-wrap-wrap">
            <div className="content-profile-wrap">
              <img
                className="content-profile"
                src="./ironman.jpg"
                alt="iron-man"
              />
            </div>
          </div>
          <div className="content-title-wrap-wrap-wrap">
            <div className="content-title-wrap-wrap">
              <div className="content-title-wrap">
                <div className="content-name-wrap">
                  <h3 className="content-name">{content.name}</h3>
                  <div className="content-date-wrap">
                    <span className="content-date">{content.date}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-content-wrap">
          <span>
            <p className="content-content">{content.content}</p>
          </span>
        </div>
        <div className="content-img-wrap">
          {content.imageURL ? (
            <img className="content-img" src={content.imageURL} alt="user" />
          ) : (
            <img className="content-img" src="./ironman.jpg" alt="iron-man" />
          )}
        </div>
      </div>
      <div className="content-footer"></div>
    </div>
  ));
//   <ul>
//     {contents.map(content => (
//       <li key={content.date}>
//         <span>
//           <strong>Writer</strong> {content.name}
//         </span>
//         <span>
//           <strong>Date</strong> {content.date}
//         </span>
//         <span>
//           <strong>Content</strong> {content.content}
//         </span>
//       </li>
//     ))}
//   </ul>
const authCondition = authUser => !!authUser;
const Feed = withAuthorization(authCondition)(FeedBase);

export default Feed;
