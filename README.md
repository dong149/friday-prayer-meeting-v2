# churchbook

[사이트 바로가기](https://friday-prayer-meeting.firebaseapp.com/)

## Description

자기의 일상을 공유하는 기독교인들만을 위한 SNS Service 입니다.

## 급하게 해야하는 사항.

1.

컨텐츠를 애초에 교회별로

ex)

contents/IlsanChangDae
같은 식으로 저장하자.
그리고 꺼낼때도
같은 방법으로 찾아서 꺼내도록 수정하자.

2.
교회별 특별 기능은 따로 애초에 클래스를 app.js에서 정의해놓고
Navigation에도 추가시켜주는 식으로
구현을 시켜놓자.
(다른 교회는 들어가지 못하게 막아야한다.)

## Feature

### WRITE

- [ ] 글에 Type --> 기도제목 / 개인나눔 / 등등.

### FEED

- [x] 글 작성기능.
- [ ] 글 삭제기능.
- [ ] 글 수정기능.
- [x] 글에 댓글 기능.
- [ ] 글에 좋아요 기능.(좋아요 누른 아이디 체크)
- [ ] 글 한 번에 모아서 보여주기 기능.(특정 조건 입력가능)
- [x] 기본 프로필 사진 넣기.
- [ ] 뉴스피드 20개씩 보이게 하는 기능.
- [ ] 교회별로 따로 보여주는 기능.(나중에 구현해도 됨).

### PROFILE

- [x] 개인 프로필 View.
- [x] 프로필 사진 변경.

### LOGIN

- [ ] 카카오톡 연동 로그인.
- [x] 구글 연동 로그인.

### .scss

- [ ] SIGNUP
- [ ] desktop/tablet 일 때 scss파일 작성

## Bug

- [ ] 사진 넣을 때, 사진이 돌아가는 버그.
- [x] 로그인 되어있는 상태에서 홈으로 돌아가지는 버그
- [ ] 버튼으로 설정한 구글 로그인 버튼 같은 것들이 디자인이 이상하게 나옴.
- [ ] 댓글을 올리면 실시간으로 값이 변하지 않음. ComponentDidMount()함수 변경이 필요함.

[참고자료](https://www.robinwieruch.de/complete-firebase-authentication-react-tutorial)
