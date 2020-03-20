import React, { Component, useState } from "react";
import * as ROUTES from "../../routes";
import {
  withAuthorization,
  AuthUserContext,
  withAuthentication
} from "../Session";
import "../../styles/feed.scss";
import { WindMillLoading } from "react-loadingg";
import _ from "lodash";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { FirebaseContext } from "../../Firebase";
const INITIAL_STATE = {
  loading: false,
  comments: [],
  comment: "",
  error: null
};
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

// Content 리스트
const ContentList = ({ contents }) => {
  const res = contents.map(content => {
    return <Content content={content} />;
  });
  return res;
};

// Comment (댓글 입력 기능 선택시 확장 영역)
class CommentFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
  }
  // 기존에 있는 코멘트들이 보이게 하는 기능
  componentDidMount() {
    this.setState({ loading: true });
    this.props.firebase.comments(this.props.date).on("value", snapshot => {
      const commentsObject = snapshot.val();
      const commentsList = Object.keys(commentsObject).map(key => ({
        ...commentsObject[key],
        uid: key
      }));

      // lodash 라이브러리를 사용하여, 기존에 존재하는 contentsList를 Reverse한다.
      _.reverse(commentsList);
      // console.log(contentsList);
      this.setState({
        comments: commentsList,
        loading: false
      });
    });
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onSubmit = async event => {
    try {
      console.log(this.props);
      const { comment } = this.state;
      const uid = this.props.firebase.doFindCurrentUID();
      const name = this.props.firebase.doFindCurrentUserName();
      this.setState({ uid: uid, name: name });

      const date = format(new Date(), "yyyyMMddHHmmss");
      this.props.firebase
        .comment(this.props.date, date)
        .set({
          uid: uid,
          comment,
          name: name,
          date: date
        })
        .then(authUser => {
          // console.log("here");
          this.setState({ ...INITIAL_STATE });
          // this.props.history.push(ROUTES.FEED);
        })
        .catch(error => {
          this.setState({ error });
        });
    } catch (error) {
      console.log(error);
    }
    event.preventDefault();
  };

  render() {
    const { comments, comment, loading, error } = this.state;
    const isInvalid = comment === "";
    return (
      <div>
        <div>
          {comments.map(comment => (
            <div>
              <span>{comment.name}</span>
              <span>{comment.comment}</span>
              <span>{comment.date}</span>
            </div>
          ))}
        </div>
        <div className="comment-form-wrap">
          <form onSubmit={this.onSubmit} className="comment-form">
            <div className="comment-input-wrap">
              <input
                className="comment-input"
                value={comment}
                type="text"
                name="comment"
                onChange={this.onChange}
                placeholder="댓글을 입력하세요."
                required={true}
              />
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              disabled={isInvalid}
            >
              작성하기
            </button>
            {error && <p>{error.message}</p>}
          </form>
        </div>
      </div>
    );
  }
}
// const CommentList = ({comments})

// Content 한 항목.
const Content = ({ content }) => {
  const [commentForm, setCommentForm] = useState(false);
  return (
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
              <input
                className="chk-write"
                value={commentForm}
                type="checkbox"
                onChange={() => setCommentForm(!commentForm)}
              />
              <span className="content-footer-bottom-comment-text">
                댓글 달기
              </span>
            </div>
          </div>
          {/* 댓글 창 */}
          {commentForm && (
            <FirebaseContext.Consumer>
              {firebase => (
                <CommentFormBase date={content.date} firebase={firebase} />
              )}
            </FirebaseContext.Consumer>
          )}
        </div>
      </div>
    </div>
  );
};

const authCondition = authUser => !!authUser;
const Feed = withAuthorization(authCondition)(FeedBase);
// const CommentForm = withAuthorization(authCondition)(CommentFormBase);
// withAuthentication(CommentFormBase);

export default Feed;
