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
      prayFormOpen: false,
      photoURL: ""
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
        this.setState({ photoURL: photoURL });
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
    const { contents, loading, prayFormOpen, photoURL } = this.state;
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
                <div className="fullscreen-content">
                  <div className="fullscreen-img-wrap">
                    <img
                      className="fullscreen-img"
                      src={photoURL}
                      alt="profile"
                    />
                  </div>
                  <div className="fullscreen-content-wrap">
                    {content.name && (
                      <div className="fullscreen-content-name-wrap">
                        <div
                          className="fullscreen-content-name"
                          // style={{ fontSize: "50px", color: "white" }}
                        >
                          {content.name}
                        </div>
                      </div>
                    )}
                    {content.content.length > 20 ? (
                      <div className="fullscreen-content-content-wrap-long">
                        <div className="fullscreen-content-content-long">
                          {content.content}
                        </div>
                      </div>
                    ) : (
                      <div className="fullscreen-content-content-wrap">
                        <div className="fullscreen-content-content">
                          {content.content}
                        </div>
                      </div>
                    )}
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
          history={this.props.history}
          prayFormOpen={prayFormOpen}
        />
        <AuthUserContext.Consumer>
          {authUser => (
            <ContentList contents={contents} history={this.props.history} />
          )}
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
          this.props.history.push(ROUTES.FRIDAY_PRAYER);
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
const ContentList = ({ contents, history }) => {
  const res = contents.map(content => {
    console.log(content);
    return (
      <FirebaseContext>
        {firebase => (
          <Content content={content} firebase={firebase} history={history} />
        )}
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
      username: "",
      currentUID: ""
    };
  }
  componentDidMount() {
    if (this.props.firebase) {
      if (this.props.content.comments) {
        const commentObject = Object.keys(this.props.content.comments);
        this.setState({ commentSize: commentObject.length });
      }
      this.setState({ content: this.props.content });
      this.props.firebase
        .user(this.props.content.uid)
        .once("value", snapshot => {
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
        .likeList(
          this.props.content.date,
          this.props.firebase.doFindCurrentUID()
        )
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
      this.setState({ currentUID: this.props.firebase.doFindCurrentUID() });
    }
  }

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

  handleContentModify = () => {
    // this.props.firebase.contentFridayPrayer(this.props.content.church,this.props.content.date)
    // .update({
    // })
    //구현해야함.
  };
  handleContentDelete = () => {
    this.props.firebase
      .contentFridayPrayer(this.props.content.church, this.props.content.date)
      .remove()
      .then(() => {
        alert("성공적으로 삭제되었습니다.");
        // this.props.history.push(ROUTES.FRIDAY_PRAYER);
      });
  };

  render() {
    const { contentOpen, username, currentUID } = this.state;
    return (
      <div className="praycontent" onClick={() => this.handleContentOpen()}>
        <div className="praycontent-wrap">
          <div className="praycontent-header-wrap">
            <div className="praycontent-header-profile-wrap">
              <FirebaseContext.Consumer>
                {firebase => (
                  <ContentProfile
                    firebase={firebase}
                    uid={this.props.content.uid}
                  />
                )}
              </FirebaseContext.Consumer>
            </div>
            <div className="praycontent-header-name-wrap">
              <span className="praycontent-header-name">{username}</span>
            </div>
            <div className="praycontent-header-date-wrap">
              <span className="praycontent-header-date">
                {handleDate(this.props.content.date)}
              </span>
            </div>
          </div>
        </div>
        {contentOpen && (
          <div>
            <div className="praycontent-content-wrap">
              <span className="praycontent-content">
                {this.props.content.content}
              </span>
            </div>
            {currentUID === this.props.content.uid && (
              <div className="praycontent-content-btn-wrap">
                <div
                  className="praycontent-content-modify-btn-wrap"
                  onClick={() => this.handleContentModify()}
                >
                  <span className="praycontent-content-modify-btn">
                    수정하기
                  </span>
                </div>
                <div
                  className="praycontent-content-delete-btn-wrap"
                  onClick={() => this.handleContentDelete()}
                >
                  <span className="praycontent-content-delete-btn">
                    삭제하기
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
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
        <img
          className="praycontent-header-profile"
          src={imageURL}
          alt="iron-man"
        />
      </>
    );
  }
}

const authCondition = authUser => !!authUser;
const FridayPrayer = withAuthorization(authCondition)(FridayPrayerBase);
// const CommentForm = withAuthorization(authCondition)(CommentFormBase);
// withAuthentication(CommentFormBase);

export default FridayPrayer;
