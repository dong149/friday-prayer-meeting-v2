import React, { Component } from "react";
import * as ROUTES from "../../routes";
import { AuthUserContext } from "../Session";
import { withAuthorization } from "../Session";
import { format } from "date-fns";
import "../../styles/profile.scss";
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

class ProfilePage extends Component {
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
                  this.props.history.push(ROUTES.PROFILE);
                  alert("성공적으로 변경되었습니다");
                })
                .catch(error => {
                  this.setState({ error });
                });
            });
        });
      }
      // else {
      //   const date = format(new Date(), "yyyyMMddHHmmss");
      //   this.props.firebase
      //     .user(date)
      //     .set({
      //       uid: uid,
      //       content,
      //       name: name,
      //       date: date,
      //       comments: [],
      //       imageURL: URL
      //     })
      //     .then(authUser => {
      //       // console.log("here");
      //       this.setState({ ...INITIAL_STATE });
      //       this.props.history.push(ROUTES.FEED);
      //     })
      //     .catch(error => {
      //       this.setState({ error });
      //     });
      // }
    } catch (e) {
      console.error(e);
    }
    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onImageChange = event => {
    if (event.target.files[0]) {
      const image = event.target.files[0];
      this.setState({
        image,
        profileImageFile: URL.createObjectURL(event.target.files[0])
      });
    }
  };
  render() {
    const { profileImageFile } = this.state;
    const isInvalid = profileImageFile === "";
    console.log(this.props.firebase.auth.currentUser);
    return (
      <div>
        <form onSubmit={this.onSubmit} className="input-wrap">
          <div className="profile-image-wrap">
            {this.props.firebase.auth.currentUser.photoURL ? (
              <img
                className="profile-image"
                src={this.props.firebase.auth.currentUser.photoURL}
                alt="profile"
              />
            ) : (
              <img
                className="profile-image"
                src="./defaultProfile.png"
                alt="profile"
              />
            )}
            <input
              className="profile-image-input"
              type="file"
              name="profileImageFile"
              accept="image/*"
              onChange={this.onImageChange}
              required={true}
            />
          </div>
          <div className="profile-userName-wrap">
            <span className=" profile-userName">
              {this.props.firebase.doFindCurrentUserName()}
            </span>
          </div>
          <button
            className="btn btn-primary"
            disabled={isInvalid}
            type="submit"
          >
            수정하기
          </button>
          <button className="btn btn-danger" disabled="" type="submit">
            계정 삭제하기
          </button>
        </form>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(ProfilePage);
