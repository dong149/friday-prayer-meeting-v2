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

const INITIAL_STATE = {
  uid: "",
  type: "", // 글의 종류
  content: "", // 글 내용
  date: "", // 작성 날짜/시간
  // 댓글 수 , 좋아요 수
  // 해당 글에 달린 댓글
  error: null
};

class WriteFormBase extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    // const { content} = this.state;
    // this.props.firebase
    //   .set({
    //     uid ,
    //     type,
    //     content,
    //     data
    //   })
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
  render() {
    console.log(this.props);
    const { content, error } = this.state;
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

const WriteForm = withRouter(withFirebase(WriteFormBase));

export default WriteForm;
