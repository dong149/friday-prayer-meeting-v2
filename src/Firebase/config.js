import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";

const config = {
  apiKey: "AIzaSyAUXV7IKPYzrnPOj213sxwbY-VE46Ouhzo",
  authDomain: "friday-prayer-meeting.firebaseapp.com",
  databaseURL: "https://friday-prayer-meeting.firebaseio.com",
  projectId: "friday-prayer-meeting",
  storageBucket: "friday-prayer-meeting.appspot.com",
  messagingSenderId: "816612453109",
  appId: "1:816612453109:web:0208ccd1c4e850b360b3bc",
  measurementId: "G-E30CTJ2ZRB"
};

// const Firebase = app.initializeApp(config);
// Firebase.auth = app.auth();
class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database();
    this.storage = app.storage();
    this.googleProvider = new app.auth.GoogleAuthProvider();
    this.facebookProvider = new app.auth.FacebookAuthProvider();
  }
  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
  doFindCurrentUID = () => this.auth.currentUser.uid;
  doFindCurrentUserName = () => this.auth.currentUser.displayName;
  doInfoCurrentUser = () => this.auth.currentUser;
  // *** Auth Google ***
  doSignInWithGoogle = () => this.auth.signInWithPopup(this.googleProvider);
  doSignInWithFacebook = () => this.auth.signInWithPopup(this.facebookProvider);

  doUpdateUserProfile = URL =>
    this.auth.currentUser.updateProfile({ photoURL: URL });

  // *** User API ***
  user = uid => this.db.ref(`users/${uid}`);
  users = () => this.db.ref("users");
  userPhoto = uid => this.db.ref(`users/${uid}/photoURL`);
  userChurch = uid => this.db.ref(`users/${uid}/church`);

  // *** Contents API ***
  content = date => this.db.ref(`contents/${date}`);
  contents = () => this.db.ref(`contents`);

  // IlsanChangDae FridayContent
  contentFridayPrayer = (church, date) =>
    this.db.ref(`${church}/contents/fridayprayer/${date}`);
  contentFridayPrayers = church =>
    this.db.ref(`${church}/contents/fridayprayer`);

  // *** Images API ***
  image = name => this.storage.ref(`images/${name}`);
  images = () => this.storage.ref(`images`);

  // *** TIME ***
  doFindCurrentTime = () => this.db.ServerValue.TIMESTAMP;

  // *** COMMENT ***
  comment = (date, commentDate) =>
    this.db.ref(`contents/${date}/comments/${commentDate}`);
  comments = date => this.db.ref(`contents/${date}/comments`);

  // *** Like ***
  likeList = (date, uid) => this.db.ref(`contents/${date}/likelist/${uid}`);
}

export default Firebase;
