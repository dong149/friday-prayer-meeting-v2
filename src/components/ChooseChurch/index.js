import React, { Component } from "react";
import * as ROUTES from "../../routes";
import { AuthUserContext } from "../Session";
import { withAuthorization } from "../Session";
import { format } from "date-fns";
import ReactModal from "react-modal";
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
  error: null,
  openModal: false,
  church: "",
  secretCode: ""
};

class ChooseChurchPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ...INITIAL_STATE
    };
  }

  componentDidMount() {
    this.props.firebase
      .userChurch(this.props.firebase.doFindCurrentUID())
      .on("value", snapshot => {
        if (snapshot.val()) {
          this.props.history.push(ROUTES.FEED);
        }
      });
  }
  handleModal = name => {
    this.setState({
      church: name,
      openModal: true
    });
  };
  closeModal = name => {
    this.setState({
      openModal: false
    });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  onSubmit = () => {
    console.log(this.state.church);
    if (this.state.church === "ilsanchangdae") {
      console.log("clicked");
      if (process.env.REACT_APP_CHANGDAE_KEY === this.state.secretCode) {
        this.props.firebase
          .user(this.props.firebase.doFindCurrentUID())
          .update({
            church: this.state.church
          })
          .then(() => {
            alert("성공적으로 등록되었습니다!");
            this.props.history.push(ROUTES.FEED);
          });
      } else {
        alert("코드가 잘못되었습니다. 다시 한 번 확인해주세요.");
      }
    }
  };
  render() {
    const { openModal, secretCode } = this.state;
    return (
      <>
        <div className="choose-church-intro-wrap">
          <span className="choose-church-intro">
            다니시는 교회를 선택해주세요.
          </span>
        </div>
        <div
          className="church-profile-wrap"
          onClick={() => this.handleModal("ilsanchangdae")}
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
        <ReactModal
          className="Modal"
          overlayClassName="Overlay"
          // style={{
          //   backgroundColor: "#222222"
          // }}
          isOpen={openModal}
          onRequestClose={() => this.closeModal()}
          // onAfterOpen={afterOpenModal}
          // onRequestClose={() => this.closeImgModal()}
          // style={this.customStyles}
          ariaHideApp={false}
          contentLabel="Example Modal"
        >
          <div className="modal-wrap">
            <div className="modal-code-wrap">
              <span className="modal-code-text">교회 코드</span>
              <span className="modal-code-description">
                ※교역자분들로부터 받으신 코드를 입력해주세요.
              </span>
              <input
                className="modal-code-input"
                type="password"
                onChange={this.onChange}
                name="secretCode"
                value={secretCode}
              />
            </div>
            <div
              className="modal-submit-btn-wrap"
              onClick={() => this.onSubmit()}
            >
              <span className="modal-submit-btn">입력하기</span>
            </div>

            {/* <div className="modal-close-wrap" onClick={() => this.closeModal()}>
              <span className="modal-close">닫기</span>
            </div> */}
          </div>
        </ReactModal>
      </>
    );
  }
}

const authCondition = authUser => !!authUser;

export default withAuthorization(authCondition)(ChooseChurchPage);
