import React, { Component, useState } from "react";
import Modal from "react-modal";
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
    this.props.firebase
      .userChurch(this.props.firebase.doFindCurrentUID())
      .on("value", snapshot => {
        if (!snapshot.val()) {
          this.props.history.push(ROUTES.CHOOSE_CHURCH);
        }
      });
    this.props.firebase
      .userPhoto(this.props.firebase.doFindCurrentUID())
      .once("value", snapshot => {
        const photoURL = snapshot.val();
        if (!photoURL) {
          this.props.firebase
            .user(this.props.firebase.doFindCurrentUID())
            .update({
              photoURL: "./defaultProfile.png"
            });
        }
      });
    this.setState({ loading: true });
    this.props.firebase.contents().on("value", snapshot => {
      const contentsObject = snapshot.val();
      const contentsList = Object.keys(contentsObject).map(key => ({
        ...contentsObject[key]
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
export const handleDate = date => {
  let dyear = parseInt(date.substring(0, 4));
  let dmonth = parseInt(date.substring(4, 6)) - 1;
  let dday = parseInt(date.substring(6, 8));
  let dhour = parseInt(date.substring(8, 10));
  let dmin = parseInt(date.substring(10, 12));
  let dsec = parseInt(date.substring(12, 14));

  let res = formatDistanceToNow(
    new Date(dyear, dmonth, dday, dhour, dmin, dsec),
    { includeSeconds: true, locale: ko }
  );

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
    console.log(content);
    return (
      <FirebaseContext>
        {firebase => <Content content={content} firebase={firebase} />}
      </FirebaseContext>
    );
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
      if (commentsObject) {
        const commentsList = Object.keys(commentsObject).map(key => ({
          ...commentsObject[key]
        }));

        // lodash 라이브러리를 사용하여, 기존에 존재하는 contentsList를 Reverse한다.
        _.reverse(commentsList);
        console.log(commentsList);
        this.setState({
          comments: commentsList,
          loading: false
        });
      }
    });
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onSubmit = async event => {
    try {
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
class Content extends Component {
  constructor(props) {
    super(props);
    this.state = {
      content: {},
      commentForm: false,
      commentSize: 0,
      liked: false,
      imgModalOpen: false
    };
  }
  componentDidMount() {
    if (this.props.content.comments) {
      const commentObject = Object.keys(this.props.content.comments);
      this.setState({ commentSize: commentObject.length });
    }
    this.setState({ content: this.props.content });

    this.props.firebase
      .likeList(this.props.content.date, this.props.firebase.doFindCurrentUID())
      .on("value", snapshot => {
        // console.log(snapshot && snapshot.exists());
        if (snapshot.val()) {
          this.setState({
            liked: true
          });
        } else {
          this.setState({
            liked: false
          });
        }
      });
  }
  setCommentForm = commentForm => {
    this.setState({ commentForm: commentForm });
  };
  setLike = () => {
    const newLike = this.props.content.like + 1;
    this.props.firebase
      .content(this.props.content.date)
      .update({
        like: newLike
      })
      .then(() => {
        this.props.firebase
          .likeList(
            this.props.content.date,
            this.props.firebase.doFindCurrentUID()
          )
          .update({
            // 나중에 감정표현 집어넣으려면 여기서 종류 넣어서 만들면 됨.
            uid: this.props.firebase.doFindCurrentUID()
          });
      });
  };
  handleImgModal = () => {
    this.setState({
      imgModalOpen: true
    });
  };
  closeImgModal = () => {
    console.log("closeModal");
    this.setState({
      imgModalOpen: false
    });
  };
  // customStyles = {
  //   content: {
  //     width: 80
  //   }
  // };
  render() {
    const { commentForm, commentSize, liked, imgModalOpen } = this.state;
    return (
      <div className="content-wrap" key={this.props.content.date}>
        <div className="content-body-wrap">
          <div className="content-header">
            <div className="content-profile-wrap-wrap">
              <div className="content-profile-wrap">
                <FirebaseContext.Consumer>
                  {firebase => (
                    <ContentProfile
                      firebase={firebase}
                      uid={this.props.content.uid}
                    />
                  )}
                </FirebaseContext.Consumer>
                {/* <img
                className="content-profile"
                src="./ironman.jpg"
                alt="iron-man"
              /> */}
              </div>
            </div>
            <div className="content-title-wrap-wrap-wrap">
              <div className="content-title-wrap-wrap">
                <div className="content-title-wrap">
                  <div className="content-name-wrap">
                    <h3 className="content-name">{this.props.content.name}</h3>
                    <div className="content-date-wrap">
                      <span className="content-date">
                        {handleDate(this.props.content.date)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="content-content-wrap">
            <span>
              <p className="content-content">{this.props.content.content}</p>
            </span>
          </div>
          {this.props.content.imageURL && (
            <div>
              <div
                className="content-img-wrap"
                onClick={() => this.handleImgModal()}
              >
                <img
                  className="content-img"
                  src={this.props.content.imageURL}
                  alt="user"
                />
              </div>
              <Modal
                className="imgModal"
                isOpen={imgModalOpen}
                onRequestClose={() => this.closeImgModal()}
                // onAfterOpen={afterOpenModal}
                // onRequestClose={() => this.closeImgModal()}
                // style={this.customStyles}
                ariaHideApp={false}
                contentLabel="Example Modal"
              >
                <div>
                  <div>
                    <div onClick={() => this.closeImgModal()}>Close Modal</div>
                  </div>
                  <div className="modal-img-wrap">
                    <img
                      className="modal-img"
                      src={this.props.content.imageURL}
                      alt="user"
                    />
                  </div>
                </div>
              </Modal>
            </div>
          )}
          <div className="content-footer">
            <div className="content-footer-top-wrap-wrap">
              <div className="content-footer-top-wrap">
                <div className="content-footer-top-like">
                  <span className="content-footer-top-like-text">
                    좋아요 {this.props.content.like}명
                  </span>
                </div>
                <div className="content-footer-top-comment">
                  <span className="content-footer-top-comment-text">
                    댓글 {commentSize}개
                  </span>
                </div>
              </div>
            </div>
            <div className="content-footer-bottom-wrap">
              <div className="content-footer-bottom-like-wrap">
                {liked ? (
                  <div onClick="">
                    <span className="content-footer-bottom-like-text">
                      눌렀어요
                    </span>
                  </div>
                ) : (
                  <div onClick={() => this.setLike()}>
                    <span className="content-footer-bottom-like-text">
                      좋아요
                    </span>
                  </div>
                )}
              </div>
              <div className="content-footer-bottom-comment-wrap">
                <div onClick={() => this.setCommentForm(!commentForm)}>
                  <span className="content-footer-bottom-comment-text">
                    댓글 달기
                  </span>
                </div>
              </div>
            </div>
            {/* 댓글 창 */}
            {commentForm && (
              <FirebaseContext.Consumer>
                {firebase => (
                  <CommentFormBase
                    date={this.props.content.date}
                    firebase={firebase}
                  />
                )}
              </FirebaseContext.Consumer>
            )}
          </div>
        </div>
      </div>
    );
  }
}

class ContentProfile extends Component {
  constructor(props) {
    super(props);
    this.state = { imageURL: "" };
  }
  componentDidMount() {
    this.props.firebase.userPhoto(this.props.uid).once("value", snapshot => {
      const imageURL = snapshot.val();
      this.setState({
        imageURL
      });
    });
  }
  render() {
    const { imageURL } = this.state;
    return (
      <>
        <img className="content-profile" src={imageURL} alt="iron-man" />
      </>
    );
  }
}

const authCondition = authUser => !!authUser;

withAuthentication(ContentProfile);
const Feed = withAuthorization(authCondition)(FeedBase);
// const CommentForm = withAuthorization(authCondition)(CommentFormBase);
// withAuthentication(CommentFormBase);

export default Feed;
