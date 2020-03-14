import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
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
  }
  // *** Auth API ***
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);

  // *** User API ***
  user = uid => this.db.ref(`users/${uid}`);
  users = () => this.db.ref("users");
}

export default Firebase;
