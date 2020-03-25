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
      isFull: false,
      prayFormOpen: false
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
  handleprayFormOpen = () => {
    const { prayFormOpen } = this.state;
    this.setState({
      prayFormOpen: !prayFormOpen
    });
  };
  render() {
    const { contents, loading, prayFormOpen } = this.state;
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
        <div className="fullscreen-wrap">
          <Fullscreen
            className="fullscreen"
            enabled={this.state.isFull}
            onChange={isFull => this.setState({ isFull })}
          >
            <AutoplaySlider
              className="auto-play-slider"
              // cssModule={}
              // className="fullscreen-slide"
              play={true}
              cancelOnInteraction={false} // should stop playing on user interaction
              interval={3000}
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
          </Fullscreen>
        </div>
        <div className="btn-wrap">
          <div
            className="write-btn-wrap"
            onClick={() => this.handleprayFormOpen()}
          >
            <span className="write-btn">작성하기</span>
          </div>
          <div className="fullscreen-btn-wrap" onClick={this.goFull}>
            <span className="fullscreen-btn">전체화면</span>
          </div>
        </div>
        <FridayInputForm
          firebase={this.props.firebase}
          prayFormOpen={prayFormOpen}
        />
        <AuthUserContext.Consumer>
          {authUser => <ContentList contents={contents} />}
        </AuthUserContext.Consumer>
      </div>
    );
  }
}

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
  render() {
    const { prayContent } = this.state;
    return (
      <div>
        {this.props.prayFormOpen && (
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
      contentOpen: false,
      username: ""
    };
  }
  componentDidMount() {
    if (this.props.content.comments) {
      const commentObject = Object.keys(this.props.content.comments);
      this.setState({ commentSize: commentObject.length });
    }
    this.setState({ content: this.props.content });
    this.props.firebase.user(this.props.content.uid).once("value", snapshot => {
      if (snapshot.val()) {
        const prevName = snapshot.val().username;
        if (prevName !== this.props.content.username) {
          this.props.firebase
            .contentFridayPrayer(
              this.props.content.church,
              this.props.content.date
            )
            .update({
              name: prevName
            });
        }
        this.setState({ username: snapshot.val().username });
      }
    });
    this.props.firebase
      .likeList(this.props.content.date, this.props.firebase.doFindCurrentUID())
      .on("value", snapshot => {
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
    const { contentOpen, username } = this.state;
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
                    <h3 className="content-name">{username}</h3>
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
