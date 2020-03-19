import React, { Component } from "react";
import * as ROUTES from "../../routes";
import { withAuthorization, AuthUserContext } from "../Session";
import "../../styles/feed.scss";
import { WindMillLoading } from "react-loadingg";
import _ from "lodash";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
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

      // lodash 라이브러리를 사용하여, 기존에 존재하는 contentsList를 Reverse한다.
      _.reverse(contentsList);
      // console.log(contentsList);
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
    return loading ? (
      <div>
        <WindMillLoading size="large" color="#5B5BDC" />
      </div>
    ) : (
      <div className="feed">
        <AuthUserContext.Consumer>
          {authUser => <ContentList contents={contents} />}
        </AuthUserContext.Consumer>
      </div>
    );
  }
}
// 언제 게시되었는지를 알려주는 함수입니다.
const handleDate = date => {
  let dyear = parseInt(date.substring(0, 4));
  let dmonth = parseInt(date.substring(4, 6)) - 1;
  let dday = parseInt(date.substring(6, 8));
  let dhour = parseInt(date.substring(8, 10));
  let dmin = parseInt(date.substring(10, 12));
  let dsec = parseInt(date.substring(12, 14));
  // console.log(dyear);
  // console.log(dmonth);
  // console.log(dday);
  // console.log(dhour);
  // console.log(dmin);
  // console.log(dsec);
  let res = formatDistanceToNow(
    new Date(dyear, dmonth, dday, dhour, dmin, dsec),
    { includeSeconds: true, locale: ko }
  );
  // console.log(res);
  // let result =
  //   year + "년" + month + "월" + day + "일" + hour + "시" + min + "분";
  let reslen = res.length;
  if (res[reslen - 1] === "만") {
    if (res[1] === "초") {
      res = res.substring(0, 2);
    } else {
      res = res.substring(0, 3);
    }
  }
  // if (res === "1분 미만") {
  //   res = "약 1분";
  // }
  let result = res + " 전";
  return result;
};
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
                    <span className="content-date">
                      {handleDate(content.date)}
                    </span>
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
        {content.imageURL && (
          <div className="content-img-wrap">
            <img className="content-img" src={content.imageURL} alt="user" />
          </div>
        )}
        <div className="content-footer">
          <div className="content-footer-top-wrap-wrap">
            <div className="content-footer-top-wrap">
              <div className="content-footer-top-like">
                <span className="content-footer-top-like-text">
                  좋아요 10명
                </span>
              </div>
              <div className="content-footer-top-comment">
                <span className="content-footer-top-comment-text">
                  댓글 1개
                </span>
              </div>
            </div>
          </div>
          <div className="content-footer-bottom-wrap">
            <div className="content-footer-bottom-like-wrap">
              <span className="content-footer-bottom-like-text">좋아요</span>
            </div>
            <div className="content-footer-bottom-comment-wrap">
              <span className="content-footer-bottom-comment-text">
                댓글 달기
              </span>
            </div>
          </div>
        </div>
      </div>
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
