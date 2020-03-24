import React, { Component, useState } from "react";
import Modal from "react-modal";
import * as ROUTES from "../../routes";
import {
  withAuthorization,
  AuthUserContext,
  withAuthentication
} from "../Session";
import "../../styles/fridayprayer.scss";
import { WindMillLoading } from "react-loadingg";
import _ from "lodash";
import { format, formatDistanceToNow } from "date-fns";
import { ko } from "date-fns/locale";
import { FirebaseContext } from "../../Firebase";
import Fullscreen from "react-full-screen";
import AwesomeSlider from "react-awesome-slider";
import AwesomeSliderStyles from "react-awesome-slider/src/styles";
import withAutoplay from "react-awesome-slider/dist/autoplay";
// import "react-awesome-slider/dist/styles.css";

const INITIAL_STATE = {
  loading: false,
  comments: [],
  comment: "",
  error: null
};
const AutoplaySlider = withAutoplay(AwesomeSlider);
class FridayPrayerBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      contents: [],
      isFull: false
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
    let church = "";
    this.setState({ loading: true });
    this.props.firebase
      .userChurch(this.props.firebase.doFindCurrentUID())
      .once("value", snapshot => {
        church = snapshot.val();
      })
      .then(() => {
        this.props.firebase
          .contentFridayPrayers(church)
          .on("value", snapshot => {
            if (!snapshot.val()) {
              this.setState({
                contents: [],
                loading: false
              });
              alert("비어있습니다. 작성해주세요.");
              return;
            }
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
      });
  }
  componentWillUnmount() {
    this.props.firebase.contents().off();
  }
  goFull = () => {
    this.setState({ isFull: true });
  };
  render() {
    const { contents, loading } = this.state;
    return loading ? (
      <div>
        <WindMillLoading size="large" color="#5B5BDC" />
      </div>
    ) : (
      <div className="feed">
        <div className="friday-prayer-img-wrap">
          <img
            className="friday-prayer-img"
            src="./fridayprayer.png"
            alt="fridayprayer"
          />
        </div>
        <FridayInputForm firebase={this.props.firebase} />
        <AuthUserContext.Consumer>
          {authUser => <ContentList contents={contents} />}
        </AuthUserContext.Consumer>

        <div className="fullscreen-wrap">
          <button onClick={this.goFull}>Go Fullscreen</button>

          <Fullscreen
            className="fullscreen"
            enabled={this.state.isFull}
            onChange={isFull => this.setState({ isFull })}
          >
            <AutoplaySlider
              // cssModule={}
              // className="fullscreen-slide"
              play={true}
              cancelOnInteraction={false} // should stop playing on user interaction
              interval={1500}
            >
              {contents.map(content => (
                <div className="fullscreen-content-wrap" style={{}}>
                  {content.name && (
                    <div
                      className="fullscreen-content-name"
                      // style={{ fontSize: "50px", color: "white" }}
                    >
                      {content.name}
                    </div>
                  )}
                  <div className="fullscreen-content-content">
                    {content.content}
                  </div>
                </div>
              ))}
            </AutoplaySlider>
            <AutoplaySlider
              // cssModule={}
              // className="fullscreen-slide"
              play={true}
              cancelOnInteraction={false} // should stop playing on user interaction
              interval={5000}
            >
              <div>아아</div>
              <div>오오</div>
              <div>이이</div>
            </AutoplaySlider>
          </Fullscreen>
        </div>
      </div>
    );
  }
}
// class SlidePrayContent extends Component{
//   constructor(props){
//     super(props);
//     this.state=({

//     })
//   }
//   render(){

//     return();
//   }

// }
// const SlidePrayContentList = ({ contents }) => {
//   // const res = contents.map(content => {
//     return (
//       // <FirebaseContext>
//       //   {firebase => <SlidePrayContent content={content} firebase={firebase} />}
//       // </FirebaseContext>
//       <AutoplaySlider
//         cssModule={AwesomeSliderStyles}
//         play={true}
//         cancelOnInteraction={false} // should stop playing on user interaction
//         interval={1000}
//       >
//         {contents.map(content=>{
//         <SlidePrayContent content={content} />
//         })}
//       </AutoplaySlider>
//     );
//   // });
//   // return res;
// };

// class SlidePrayContent extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       content: {},
//       commentForm: false,
//       commentSize: 0,
//       liked: false,
//       imgModalOpen: false,
//       contentOpen: false
//     };
//   }
//   componentDidMount() {
//     this.setState({ content: this.props.content });
//   }
//   render() {
//     const { content } = this.state;
//     console.log(content.content);

//     return <div className="test">{this.props.content.content}</div>;
//   }
// }

const INITIAL_STATE_INPUT = {
  prayContent: "",
  loading: false,
  name: "",
  uid: "",
  prayFormOpen: false
};
class FridayInputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE_INPUT
    };
  }
  onSubmit = async () => {
    const { prayContent } = this.state;
    if (prayContent === "") {
      alert("글을 작성해주세요.");
      return;
    }
    try {
      this.setState({ loading: true });
      const uid = this.props.firebase.doFindCurrentUID();
      const name = this.props.firebase.doFindCurrentUserName();
      const date = format(new Date(), "yyyyMMddHHmmss");
      let church;
      this.props.firebase
        .userChurch(uid)
        .once("value", snapshot => {
          church = snapshot.val();
        })
        .then(() => {
          console.log(church);
          this.props.firebase.contentFridayPrayer(church, date).set({
            church: church,
            name: name,
            uid: uid,
            date: date,
            content: prayContent,
            like: 0,
            comments: []
          });
        })
        .then(() => {
          alert("성공적으로 제출되었습니다");
          this.setState({
            ...INITIAL_STATE_INPUT
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  handleprayFormOpen = () => {
    const { prayFormOpen } = this.state;
    this.setState({
      prayFormOpen: !prayFormOpen
    });
  };
  render() {
    const { prayContent, prayFormOpen } = this.state;
    return (
      <div>
        {prayFormOpen ? (
          <div className="pray-form-wrap">
            <div className="pray-content-wrap">
              <textarea
                className="form-control"
                name="prayContent"
                required={true}
                value={prayContent}
                onChange={this.onChange}
                rows="5"
                placeholder="기도제목을 번호로 나눠서 작성해주세요.&#13;&#10;ex)&#13;&#10;1.가족 건강하도록. .&#13;&#10;2.코로나가 하루빨리 해결되도록.&#13;&#10;3.지혜와 체력주시도록."
              ></textarea>
            </div>
            <div className="pray-content-btn-wrap">
              <div
                className="btn btn-success pray-content-btn"
                onClick={() => this.onSubmit()}
              >
                제출하기
              </div>
            </div>
          </div>
        ) : (
          <div className="pray-content-btn-wrap">
            <div
              className="btn btn-danger pray-content-btn"
              onClick={() => this.handleprayFormOpen()}
            >
              작성하기
            </div>
          </div>
        )}
        {prayFormOpen ? (
          <div
            className="btn btn-success pray-content-btn"
            onClick={() => this.handleprayFormOpen()}
          >
            슬라이드쇼
          </div>
        ) : (
          <div className="pray-content-btn-wrap">
            <div
              className="btn btn-danger pray-content-btn"
              onClick={() => this.handleprayFormOpen()}
            >
              슬라이드쇼
            </div>
          </div>
        )}
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
      imgModalOpen: false,
      contentOpen: false
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

  handleContentOpen = () => {
    const { contentOpen } = this.state;
    this.setState({
      contentOpen: !contentOpen
    });
  };
  render() {
    const { contentOpen } = this.state;
    return (
      <div className="content-wrap" key={this.props.content.date}>
        <div className="content-body-wrap">
          <div
            className="content-header"
            onClick={() => this.handleContentOpen()}
          >
            <div className="content-profile-wrap-wrap"></div>
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
          {contentOpen && (
            <div
              className="content-content-wrap"
              onClick={() => this.handleContentOpen()}
            >
              <div className="content-content">
                {this.props.content.content}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;
const FridayPrayer = withAuthorization(authCondition)(FridayPrayerBase);
// const CommentForm = withAuthorization(authCondition)(CommentFormBase);
// withAuthentication(CommentFormBase);

export default FridayPrayer;
