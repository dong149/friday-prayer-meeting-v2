import React, { Component } from "react";
import * as ROUTES from "../../routes";
import { AuthUserContext } from "../Session";
import { withAuthorization } from "../Session";
import { format } from "date-fns";
import "../../styles/feedback.scss";
const INITIAL_STATE = {
  name: "",
  uid: "",
  error: null,
  feedback: "",
};

class FeedbackPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE,
    };
  }
  componentDidMount() {
    const uid = this.props.firebase.doFindCurrentUID();
    const name = this.props.firebase.doFindCurrentUserName();
    this.setState({
      uid: uid,
      name: name,
    });
  }
  onSubmit = () => {
    const { uid, name, feedback } = this.state;
    const date = format(new Date(), "yyyyMMddHHmmss");
    this.props.firebase
      .feedback(date)
      .set({
        uid: uid,
        name: name,
        feedback: feedback,
      })
      .then(() => {
        alert("소중한 의견 감사합니다!");
        this.setState({
          ...INITIAL_STATE,
        });
        this.props.history.push(ROUTES.FEED);
      })
      .catch((error) => {
        this.setState({ error: error });
      });
  };
  onChange = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    // const isInvalid = profileImageFile === "" && name === "";
    const { feedback } = this.state;
    console.log(this.props.firebase.auth.currentUser);
    const isInvalid = feedback === "";
    return (
      <div className="feedback-form">
        <div className="feedback-text-wrap">
          <span className="feedback-text">피드백</span>
        </div>
        <div className="feedback-input-wrap">
          <textarea
            className="feedback-input"
            type="textarea"
            name="feedback"
            onChange={this.onChange}
            required={true}
            rows="10"
            placeholder="의견, 에러 등등 편하게 작성해주세요!"
          />
        </div>
        <div
          className="feedback-btn-wrap"
          onClick={() => this.onSubmit()}
          disabled={isInvalid}
        >
          <div className="feedback-btn">제출하기</div>
        </div>
      </div>
    );
  }
}

const authCondition = (authUser) => !!authUser;

export default withAuthorization(authCondition)(FeedbackPage);
