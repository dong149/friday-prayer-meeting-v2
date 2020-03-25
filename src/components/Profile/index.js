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
      const { image, name } = this.state;

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
              URL = firebaseURL;
            })
            .then(result => {
              this.props.firebase
                .doUpdateUserProfile(URL)
                .then(authUser => {
                  if (name) {
                    this.props.firebase.doUpdateUserDisplayName({
                      username: name
                    });
                  }
                })
                .then(() => {
                  if (name) {
                    this.props.firebase.user(uid).update({
                      photoURL: URL,
                      username: name
                    });
                  } else {
                    this.props.firebase.user(uid).update({
                      photoURL: URL
                    });
                  }
                  this.setState({ ...INITIAL_STATE });
                  this.props.history.push(ROUTES.FEED);
                  alert("프로필 사진과 이름이 성공적으로 변경되었습니다");
                })
                .catch(error => {
                  this.setState({ error });
                });
            });
        });
      } else {
        // .then(authUser => {
        //   authUser.user.updateProfile({
        //     displayName: username,
        //     photoURL: "./defaultProfile.png"
        //   });
        //   // Create a user in your Firebase realtime database
        //   return this.props.firebase.user(authUser.user.uid).set({
        //     username,
        //     email,
        //     photoURL: "./defaultProfile.png"
        //   });
        if (name) {
          this.props.firebase.doUpdateUserDisplayName(name).then(authUser => {
            this.props.firebase.user(uid).update({
              username: name
            });
            this.props.history.push(ROUTES.FEED);
            alert("이름이 성공적으로 변경되었습니다.");
          });
        }
      }
    } catch (e) {
      console.error(e);
    }
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
  componentDidMount() {
    this.props.firebase
      .userPhoto(this.props.firebase.doFindCurrentUID())
      .on("value", snapshot => {
        const imageURL = snapshot.val();
        this.setState({
          imageURL
        });
      });
  }
  render() {
    const { profileImageFile, imageURL, name } = this.state;
    // const isInvalid = profileImageFile === "" && name === "";
    console.log(this.props.firebase.auth.currentUser);
    return (
      <div>
        <div className="input-wrap">
          <div className="profile-image-wrap">
            {imageURL ? (
              <img className="profile-image" src={imageURL} alt="profile" />
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
            <span>이름</span>
            <input
              className="profile-userName"
              name="name"
              type="text"
              placeholder={this.props.firebase.doFindCurrentUserName()}
              onChange={this.onChange}
            />
          </div>
          <button className="btn btn-primary" onClick={() => this.onSubmit()}>
            수정하기
          </button>
          <button className="btn btn-danger" disabled="" type="submit">
            계정 삭제하기
          </button>
        </div>
      </div>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(ProfilePage);
