import React, { Component } from "react";
import * as ROUTES from "../../routes";
import { AuthUserContext } from "../Session";
import { withAuthorization } from "../Session";
import { format } from "date-fns";
import "../../styles/chooseChurch.scss";
const INITIAL_STATE = {
  loading: false,
  uid: "",
  name: "",
  type: "", // 글의 종류
  content: "", // 글 내용
  date: "", // 작성 날짜/시간
  image: null,
  imageURL: "",
  profileImageFile: null,
  like: 0, // 좋아요 수
  comments: [], //댓글
  error: null
};

class ChooseChurchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
  }

  onSubmit = async event => {
    try {
      this.setState({ loading: true });
      const { image } = this.state;

      // 현재 접속중인  user 의 id
      const uid = this.props.firebase.doFindCurrentUID();
      // const time = "";
      this.setState({ uid: uid });
      let URL = "";

      if (image) {
        const storageRef = this.props.firebase.image(image.name);
        storageRef.put(image).then(result => {
          this.props.firebase
            .images()
            .child(image.name)
            .getDownloadURL()
            .then(firebaseURL => {
              this.setState({ imageURL: firebaseURL });
              console.log(firebaseURL);
              URL = firebaseURL;
            })
            .then(result => {
              this.props.firebase
                .doUpdateUserProfile(URL)
                .then(authUser => {
                  this.props.firebase.user(uid).update({
                    photoURL: URL
                  });
                  console.log("here");
                  this.setState({ ...INITIAL_STATE });
                  this.props.history.push(ROUTES.FEED);
                  alert("성공적으로 변경되었습니다");
                })
                .catch(error => {
                  this.setState({ error });
                });
            });
        });
      }
    } catch (e) {
      console.error(e);
    }
    event.preventDefault();
  };
  handleSubmit = name => {
    console.log(name);
    this.props.firebase
      .user(this.props.firebase.doFindCurrentUID())
      .update({
        church: name
      })
      .then(() => {
        this.props.history.push(ROUTES.FEED);
      });
  };
  componentDidMount() {
    this.props.firebase
      .userChurch(this.props.firebase.doFindCurrentUID())
      .on("value", snapshot => {
        if (snapshot.val()) {
          this.props.history.push(ROUTES.FEED);
        }
      });
  }
  render() {
    console.log(this.props);
    return (
      <div>
        <div className="choose-church-intro-wrap">
          <span className="choose-church-intro">
            다니시는 교회를 선택해주세요.
          </span>
        </div>
        <div
          className="church-profile-wrap"
          onClick={() => this.handleSubmit("IlsanChangDae")}
        >
          <img
            className="church-profile-image"
            src="./changdae.jpeg"
            alt="changdae"
          />
          <div className="church-profile-name-wrap">
            <span className="church-profile-name">창대교회</span>
          </div>
          <div className="church-profile-address-wrap">
            <span className="church-profile-address">
              경기도 고양시 일산동구 강촌로 24 5층
            </span>
          </div>
        </div>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(ChooseChurchPage);
