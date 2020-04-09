import React, { Component, useState } from "react";
import Modal from "react-modal";
import * as ROUTES from "../../routes";
import {
  withAuthorization,
  AuthUserContext,
  withAuthentication,
} from "../Session";
import "../../styles/fridayprayer.scss";
import { WindMillLoading, SemipolarLoading } from "react-loadingg";
import _ from "lodash";
import { format, formatDistanceToNow, add } from "date-fns";
import { ko } from "date-fns/locale";
import { FirebaseContext } from "../../Firebase";
import Fullscreen from "react-full-screen";
import AwesomeSlider from "react-awesome-slider";
import AwesomeSliderStyles from "react-awesome-slider/src/styles";
import withAutoplay from "react-awesome-slider/dist/autoplay";
import BounceLoader from "react-spinners/BounceLoader";
import { css } from "@emotion/core";
// import "react-awesome-slider/dist/styles.css";

const INITIAL_STATE = {
  loading: false,
  comments: [],
  comment: "",
  error: null,
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
      photoURL: "",
      fridayDate: "",
      isBottom: false,
      showItem: 4,
      rawDate: "",
      contentOpen: false,
      controlTimeOpen: false,
      time: 5,
      interval: 5000,
    };
  }

  // onScroll = () => {
  //   // 맨 아래에 도착했을 경우
  //   if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
  //     console.log("bottom");
  //     this.setState({ isBottom: true });
  //   }
  // };
  componentWillUnmount() {
    this.props.firebase.contents().off();
  }
  componentDidMount() {
    // window.addEventListener("scroll", this.onScroll);

    const todayDay = new Date().getDay();
    // let fridayDate = new Date().getDate();
    let fridayDate;
    if (todayDay === 6) {
      fridayDate = add(new Date(), { days: 6 });
    } else {
      fridayDate = add(new Date(), { days: 5 - todayDay });
    }
    console.log(fridayDate);
    let rawDate = fridayDate;
    let resDate = format(fridayDate, "M월 d일");
    this.setState({
      fridayDate: resDate,
      rawDate: rawDate,
    });
    this.props.firebase
      .userChurch(this.props.firebase.doFindCurrentUID())
      .on("value", (snapshot) => {
        if (!snapshot.val()) {
          this.props.history.push(ROUTES.CHOOSE_CHURCH);
        }
      });
    this.props.firebase
      .userPhoto(this.props.firebase.doFindCurrentUID())
      .once("value", (snapshot) => {
        const photoURL = snapshot.val();
        if (!photoURL) {
          this.props.firebase
            .user(this.props.firebase.doFindCurrentUID())
            .update({
              photoURL: "./defaultProfile.png",
            });
        }
        this.setState({ photoURL: photoURL });
      });
    let church = "";
    this.setState({ loading: true });
    this.props.firebase
      .userChurch(this.props.firebase.doFindCurrentUID())
      .once("value", (snapshot) => {
        church = snapshot.val();
      })
      .then(() => {
        this.props.firebase
          .contentFridayPrayers(church)
          .on("value", (snapshot) => {
            if (!snapshot.val()) {
              this.setState({
                contents: [],
                loading: false,
              });
              alert("비어있습니다. 작성해주세요.");
              return;
            }
            const contentsObject = snapshot.val();
            const contentsList = Object.keys(contentsObject).map((key) => ({
              ...contentsObject[key],
            }));

            // lodash 라이브러리를 사용하여, 기존에 존재하는 contentsList를 Reverse한다.
            _.reverse(contentsList);
            // console.log(contentsList);
            this.setState({
              contents: contentsList,
              loading: false,
            });
          });
      });
  }

  goFull = () => {
    this.setState({ isFull: true });
  };
  handleprayFormOpen = () => {
    const { prayFormOpen } = this.state;
    this.setState({
      prayFormOpen: !prayFormOpen,
    });
  };
  // Content 리스트
  ContentList = (contents, history) => {
    const { showItem, isBottom, rawDate, contentOpen } = this.state;

    // if (isBottom) {
    //   this.setState({ showItem: showItem + 4, isBottom: false });
    // }

    const res = contents
      .filter((content) => {
        const { rawDate } = this.state;
        const year = content.date.slice(0, 4);
        const month = content.date.slice(4, 6);
        const day = content.date.slice(6, 8);
        const contentDay = new Date(year, month - 1, day).getDay();
        const contentDate = new Date(year, month - 1, day);
        let contentFridayDate;

        // fridayDate 에 해당 content 의 금요일이 뜨게끔 해야한다.
        if (contentDay === 6) {
          contentFridayDate = add(contentDate, { days: 6 });
        } else {
          contentFridayDate = add(contentDate, { days: 5 - contentDay });
        }
        const aDate = format(rawDate, "yyyyMMdd");
        const bDate = format(contentFridayDate, "yyyyMMdd");
        // console.log(contentFridayDate);
        // console.log(rawDate);
        if (aDate === bDate) {
          return true;
        }
        return false;
      })
      .map((content, index) => {
        // console.log(content, index);
        return (
          <FirebaseContext.Consumer key={index}>
            {(firebase) => (
              <Content
                content={content}
                firebase={firebase}
                history={history}
                contentOpen={contentOpen}
              />
            )}
          </FirebaseContext.Consumer>
        );
      });
    return res;
  };
  // 최근의 컨텐츠를 보여줍니다. 날짜를 일주일 뒤로 밀어야됨.
  beforeContent = () => {
    const { rawDate } = this.state;
    const beforeDate = add(rawDate, { days: 7 });
    const newFridayDate = format(beforeDate, "M월 d일");
    this.setState({
      rawDate: beforeDate,
      fridayDate: newFridayDate,
    });
  };
  // 지난 컨텐츠를 보여줍니다. 날짜를 일주일 앞으로 당겨야함.
  nextContent = () => {
    const { rawDate } = this.state;
    const nextDate = add(rawDate, { days: -7 });
    const newFridayDate = format(nextDate, "M월 d일");
    this.setState({
      rawDate: nextDate,
      fridayDate: newFridayDate,
    });
  };
  openContentOnce = () => {
    const { contentOpen } = this.state;
    this.setState({
      contentOpen: !contentOpen,
    });
  };

  handleControlTime = () => {
    const { controlTimeOpen } = this.state;
    this.setState({
      controlTimeOpen: !controlTimeOpen,
    });
  };
  onTimeChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onTimeSubmit = () => {
    const { time } = this.state;
    // time 에다가 1000을 곱해주어야한다.
    const interval = parseInt(time) * 1000;
    console.log(interval);
    this.setState({
      interval: interval,
    });
    alert(`${time}초로 적용되었습니다.`);
  };
  render() {
    const {
      contents,
      loading,
      prayFormOpen,
      photoURL,
      fridayDate,
      isBottom,
      rawDate,
      contentOpen,
      controlTimeOpen,
      time,
      interval,
    } = this.state;
    console.log(interval);

    let fullscreenItem = (content) => {
      if (content.content.length > 300) {
        return (
          <div className="fullscreen-content-content-300-wrap">
            <div className="fullscreen-content-content-300">
              {content.content}
            </div>
          </div>
        );
      } else if (content.content.length > 200) {
        return (
          <div className="fullscreen-content-content-200-wrap">
            <div className="fullscreen-content-content-200">
              {content.content}
            </div>
          </div>
        );
      } else if (content.content.length > 100) {
        return (
          <div className="fullscreen-content-content-100-wrap">
            <div className="fullscreen-content-content-100">
              {content.content}
            </div>
          </div>
        );
      } else if (content.content.length > 50) {
        return (
          <div className="fullscreen-content-content-50-wrap">
            <div className="fullscreen-content-content-50">
              {content.content}
            </div>
          </div>
        );
      } else if (content.content.length > 20) {
        return (
          <div className="fullscreen-content-content-20-wrap">
            <div className="fullscreen-content-content-20">
              {content.content}
            </div>
          </div>
        );
      } else {
        return (
          <div className="fullscreen-content-content-wrap">
            <div className="fullscreen-content-content">{content.content}</div>
          </div>
        );
      }
    };
    return loading ? (
      <SemipolarLoading size="large" color="#5B5BDC" />
    ) : (
      <div className="friday-feed">
        <div className="friday-date-wrap">
          <span className="friday-date">-{fridayDate}-</span>
        </div>
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
            onChange={(isFull) => this.setState({ isFull })}
          >
            <AutoplaySlider
              className="auto-play-slider"
              // cssModule={}
              // className="fullscreen-slide"
              play={true}
              // startupScreen={}
              cancelOnInteraction={false} // should stop playing on user interaction
              interval={interval}
            >
              {contents
                .filter((content) => {
                  const year = content.date.slice(0, 4);
                  const month = content.date.slice(4, 6);
                  const day = content.date.slice(6, 8);
                  const contentDay = new Date(year, month - 1, day).getDay();
                  const contentDate = new Date(year, month - 1, day);
                  let contentFridayDate;

                  // fridayDate 에 해당 content 의 금요일이 뜨게끔 해야한다.
                  if (contentDay === 6) {
                    contentFridayDate = add(contentDate, { days: 6 });
                  } else {
                    contentFridayDate = add(contentDate, {
                      days: 5 - contentDay,
                    });
                  }
                  const aDate = format(rawDate, "yyyyMMdd");
                  const bDate = format(contentFridayDate, "yyyyMMdd");
                  // console.log(contentFridayDate);
                  // console.log(rawDate);
                  if (aDate === bDate) {
                    return true;
                  }
                  return false;
                })
                .map((content, index) => (
                  <div key={index} className="fullscreen-content">
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
                      {fullscreenItem(content)}
                      {/* {content.content.length > 20 ? (
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
                      )} */}
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
        <div className="feature-wrap">
          <div
            className="openContent-wrap"
            onClick={() => this.openContentOnce()}
          >
            {contentOpen ? (
              <span className="openContent">한번에 닫기</span>
            ) : (
              <span className="openContent">한번에 보기</span>
            )}
          </div>
          {controlTimeOpen ? (
            <>
              <div
                className="timeClose-btn-wrap"
                onClick={() => this.handleControlTime()}
              >
                <span className="timeClose-btn">닫기</span>
              </div>
              <div className="timeInput-wrap">
                <input
                  type="text"
                  name="time"
                  onChange={this.onTimeChange}
                  placeholder="5"
                  className="timeInput"
                />
                <span className="timeInput-text">초</span>
                <div className="timeSubmit-btn-wrap-wrap">
                  <div
                    className="timeSubmit-btn-wrap"
                    onClick={() => this.onTimeSubmit()}
                  >
                    <span className="timeSubmit-btn">적용하기</span>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div
              className="controlTime-wrap"
              onClick={() => this.handleControlTime()}
            >
              <span className="controlTime">시간 조절</span>
            </div>
          )}
        </div>
        <FridayInputForm
          firebase={this.props.firebase}
          history={this.props.history}
          prayFormOpen={prayFormOpen}
        />
        {this.ContentList(contents, this.props.history)}
        <div className="pagination-wrap">
          <div className="before-wrap" onClick={() => this.beforeContent()}>
            <span className="before">최근 주</span>
          </div>
          <div className="next-wrap" onClick={() => this.nextContent()}>
            <span className="next">지난 주</span>
          </div>
        </div>
      </div>
    );
  }
}

const INITIAL_STATE_INPUT = {
  prayContent: "",
  loading: false,
  name: "",
  uid: "",
  prayFormOpen: false,
};
class FridayInputForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE_INPUT,
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
        .once("value", (snapshot) => {
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
            comments: [],
          });
        })
        .then(() => {
          alert("성공적으로 제출되었습니다");
          this.props.history.push(ROUTES.FRIDAY_PRAYER);
          this.setState({
            ...INITIAL_STATE_INPUT,
          });
        });
    } catch (error) {
      console.log(error);
    }
  };
  onChange = (event) => {
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
                placeholder="기도제목을 번호로 나눠서 작성해주세요."
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
export const handleDate = (date) => {
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
      contentOpenState: false,
      username: "",
      currentUID: "",
    };
  }
  componentDidMount() {
    if (this.props.firebase) {
      this.setState({ content: this.props.content });
      this.props.firebase
        .user(this.props.content.uid)
        .on("value", (snapshot) => {
          if (snapshot.val()) {
            const prevName = snapshot.val().username;
            if (prevName !== this.props.content.username) {
              this.props.firebase
                .contentFridayPrayer(
                  this.props.content.church,
                  this.props.content.date
                )
                .update({
                  name: prevName,
                });
            }
            this.setState({ username: snapshot.val().username });
          }
        });
      this.setState({ currentUID: this.props.firebase.doFindCurrentUID() });
    }
  }

  handleImgModal = () => {
    this.setState({
      imgModalOpen: true,
    });
  };
  closeImgModal = () => {
    console.log("closeModal");
    this.setState({
      imgModalOpen: false,
    });
  };

  handleContentOpen = () => {
    const { contentOpenState } = this.state;
    this.setState({
      contentOpenState: !contentOpenState,
    });
  };

  handleContentModify = () => {
    alert("개발중입니다. 삭제하고 다시 작성해주세요.");
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
    const { contentOpenState, username, currentUID } = this.state;

    return (
      <div className="praycontent" onClick={() => this.handleContentOpen()}>
        <div className="praycontent-wrap">
          <div className="praycontent-header-wrap">
            <div className="praycontent-header-profile-wrap">
              <FirebaseContext.Consumer>
                {(firebase) => (
                  <ContentProfile
                    firebase={firebase}
                    uid={this.props.content.uid}
                  />
                )}
              </FirebaseContext.Consumer>
            </div>
            <div className="praycontent-header-name-wrap">
              <span className="praycontent-header-name">
                {this.props.content.name}
              </span>
            </div>
            <div className="praycontent-header-date-wrap">
              <span className="praycontent-header-date">
                {handleDate(this.props.content.date)}
              </span>
            </div>
          </div>
        </div>
        {(this.props.contentOpen || contentOpenState) && (
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
                  <span className="praycontent-content-delete-btn">기</span>
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
    this.props.firebase.userPhoto(this.props.uid).once("value", (snapshot) => {
      const imageURL = snapshot.val();
      this.setState({
        imageURL,
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

const authCondition = (authUser) => !!authUser;
const FridayPrayer = withAuthorization(authCondition)(FridayPrayerBase);
// const CommentForm = withAuthorization(authCondition)(CommentFormBase);
// withAuthentication(CommentFormBase);

export default FridayPrayer;
