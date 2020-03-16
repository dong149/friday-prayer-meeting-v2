// 1. firebase 에 값 입력.
// 2. 입력할 때, 현재 로그인되어있는 유저 아이디 저장.
// 3. 보여줄 때는 한번에 쫙 긁어오기.

// 매 render 마다 console.log(this.props) 해서 props가 어떻게 전달되는건지 이해하자.
// 현재 유저 ID를 어디선가 가져와야하는데, 담겨있는 부분이 어딘지 잘 이해가 안되는 상황.
// 찾아서 가져오자. onSubmit 완성해야함.
import React, { Component } from "react";
import { withFirebase } from "../../Firebase";
import * as ROUTES from "../../routes";
import { withRouter } from "react-router-dom";
import { withAuthorization } from "../Session";

const INITIAL_STATE = {
  uid: "",
  name: "",
  type: "", // 글의 종류
  content: "", // 글 내용
  date: "", // 작성 날짜/시간
  image: null,
  imageURL: "",
  // 댓글 수 , 좋아요 수
  // 해당 글에 달린 댓글
  error: null
};

class WriteFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    // 현재 접속중인 유저의 uid를 가져옵니다.
    // const uid = this.props.firebase.doFindCurrentUID();
    const name = this.props.firebase.doFindCurrentUserName();
    console.log(name);
    // // State의 uid에 저장해줍니다.
    // this.setState({
    //   uid: uid,
    //   name: name
    // });
  }

  onSubmit = event => {
    const { content, image, imageURL } = this.state;
    const uid = this.props.firebase.doFindCurrentUID();
    const name = this.props.firebase.doFindCurrentUserName();
    // var imageURL;
    if (image !== null) {
      const uploadTask = this.props.firebase.image(image.name).put(image);
      uploadTask.on(
        "state_changed",
        snapshot => {
          console.log(snapshot);
        },
        err => {
          console.log(err);
        },
        () => {
          this.props.firebase
            .images()
            .child(image.name)
            .getDownloadURL()
            .then(firebaseURL => {
              this.setState({ imageURL: firebaseURL });
              //   imageURL = firebaseURL;
            });
        }
      );
    }
    // console.log(imageURL);
    // const { imageURL } = this.state;

    // State의 uid에 저장해줍니다.
    this.setState({ uid: uid, name: name });
    const d = new Date();
    const currentDate =
      d.getFullYear().toString() +
      (d.getMonth() + 1).toString() +
      d.getDate().toString() +
      d.getHours().toString() +
      d.getMinutes().toString() +
      d.getSeconds().toString();
    this.setState({ date: currentDate });
    const date = currentDate;
    this.props.firebase
      .content(date)
      .set({
        uid: uid,
        content,
        name: name,
        date: date
        // imageURL
      })
      .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.WRITE);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
    //   .then(authUser => {
    //     this.setState({ ...INITIAL_STATE });
    //     this.props.history.push(ROUTES.HOME);
    //   })
    //   .catch(error => {
    //     this.setState({ error });
    //   });
    // event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onImageChange = event => {
    if (event.target.files[0]) {
      const image = event.target.files[0];
      this.setState({ image });
    }
  };

  render() {
    const { content, error } = this.state;
    // const x = this.props.firebase;
    // console.log(x);
    const isInvalid = content === "";
    return (
      <form onSubmit={this.onSubmit} className="input-wrap">
        <p className="input-login-text">글</p>
        <input
          className="input-login"
          type="textarea"
          value={content}
          name="content"
          onChange={this.onChange}
          required={true}
        />
        <input
          className="input-file"
          type="file"
          name="image"
          accept="image/*"
          onChange={this.onImageChange}
          required={false}
        />

        <div className="input-submit-wrap">
          <button className="input-submit" disabled={isInvalid} type="submit">
            작성하기
          </button>

          {error && <p>{error.message}</p>}
        </div>
      </form>
    );
  }
}
const authCondition = authUser => !!authUser;
const WriteForm = withAuthorization(authCondition)(WriteFormBase);

export default WriteForm;
