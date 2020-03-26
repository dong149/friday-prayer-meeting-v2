import React from "react";
import { withFirebase } from "../../Firebase";
const SignOutButton = ({ firebase }) => (
  <div className="menu-visible-link-text" onClick={firebase.doSignOut}>
    <span className="menu-visible-span">로그아웃</span>
  </div>
);
export default withFirebase(SignOutButton);

// <div className="menu-visible-link">
//               <Link to={ROUTES.ADMIN} className="menu-visible-link-text">
//                 <span className="menu-visible-span">관리자</span>
//               </Link>
//             </div>
