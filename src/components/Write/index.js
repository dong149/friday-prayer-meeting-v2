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
import "../../styles/write.scss";
import { format } from "date-fns";
const INITIAL_STATE = {
  loading: false,
  uid: "",
  name: "",
  type: "", // 글의 종류
  content: "", // 글 내용
  date: "", // 작성 날짜/시간
  image: null,
  imageURL: "",
  imageFile: null,
  like: 0, // 좋아요 수
  comments: [], //댓글
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
  onSubmit = async event => {
    try {
      this.setState({ loading: true });
      const { content, image, like, comments } = this.state;
      const uid = this.props.firebase.doFindCurrentUID();
      const name = this.props.firebase.doFindCurrentUserName();
      // const time = "";
      this.setState({ uid: uid, name: name });
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
              const date = format(new Date(), "yyyyMMddHHmmss");
              this.props.firebase
                .content(date)
                .set({
                  uid: uid,
                  content,
                  name: name,
                  date: date,
                  imageURL: URL,
                  like,
                  comments: []
                })
                .then(authUser => {
                  console.log("here");
                  this.setState({ ...INITIAL_STATE });
                  this.props.history.push(ROUTES.FEED);
                })
                .catch(error => {
                  this.setState({ error });
                });
            });
        });
      } else {
        // const d = new Date();
        // const currentDate =
        //   d.getFullYear().toString() +
        //   (d.getMonth() + 1).toString() +
        //   d.getDate().toString() +
        //   d.getHours().toString() +
        //   d.getMinutes().toString() +
        //   d.getSeconds().toString();
        // this.setState({ date: currentDate });
        const date = format(new Date(), "yyyyMMddHHmmss");
        this.props.firebase
          .content(date)
          .set({
            uid: uid,
            content,
            name: name,
            date: date,
            like,
            comments: [],
            imageURL: URL
          })
          .then(authUser => {
            // console.log("here");
            this.setState({ ...INITIAL_STATE });
            this.props.history.push(ROUTES.FEED);
          })
          .catch(error => {
            this.setState({ error });
          });
      }
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
        imageFile: URL.createObjectURL(event.target.files[0])
      });
    }
  };

  render() {
    const { content, error, loading } = this.state;
    // const x = this.props.firebase;
    // console.log(x);
    const isInvalid = content === "";
    if (!loading) {
      return (
        <form onSubmit={this.onSubmit} className="input-wrap">
          <p className="input-login-text">내용</p>
          <textarea
            className="form-control"
            type="textarea"
            value={content}
            name="content"
            onChange={this.onChange}
            required={true}
            rows="10"
          />
          <input
            className="input-file"
            type="file"
            name="image"
            accept="image/*"
            onChange={this.onImageChange}
            required={false}
          />
          {this.state.imageFile && (
            <div className="input-file-preview-wrap">
              <img
                className="input-file-preview"
                src={this.state.imageFile}
                alt="Uploaded Images"
                height="300"
                width="400"
              />
            </div>
          )}
          <div className="input-submit-wrap">
            <button
              className="btn btn-primary"
              disabled={isInvalid}
              type="submit"
            >
              작성하기
            </button>

            {error && <p>{error.message}</p>}
          </div>
        </form>
      );
    } else {
      return <span>로딩중...</span>;
    }
  }
}
const authCondition = authUser => !!authUser;
const WriteForm = withAuthorization(authCondition)(WriteFormBase);

export default WriteForm;
