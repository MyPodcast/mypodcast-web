import firebase from "./firebase";
import axios from "axios";
import { Octokit } from "@octokit/core";

/**
 * Github connector class. Makes link between the firebase API and the frontend
 *
 * @author Maxime "M4x1m3" FRIESS
 * @license MIT
 */
export default class GithubConnector {
  static __instance = null;
  static __allowed_chars_file = "abcdefghijklmnopqrstuvwxyz1234567890_";
  static __init_file_content = "[]";

  constructor() {
    this.onAuthStateChangedHandler = [];
    this.user = null;
    this.gist = null;
    this.podcasts = null;
    this.call = 0;

    firebase.auth().onAuthStateChanged(
      function (user) {
        if (user) {
          this.user = user;
        } else {
          this.user = null;
        }

        for (var i in this.onAuthStateChangedHandler) {
          this.onAuthStateChangedHandler[i]();
        }
      }.bind(this)
    );
  }

  /**
   * @returns {GithubConnector}
   */
  static getInstance() {
    if (GithubConnector.__instance == null) {
      GithubConnector.__instance = new GithubConnector();
    }

    return this.__instance;
  }

  getUserName() {
    if (this.user !== null) {
      return this.user.displayName;
    } else {
      return null;
    }
  }

  getUserPhotoURL() {
    if (this.user !== null) {
      return this.user.photoURL;
    } else {
      return null;
    }
  }

  onAuthStateChanged(changed_func) {
    this.onAuthStateChangedHandler.push(changed_func);
  }

  removeAuthStateChanged(changed_func) {
    this.onAuthStateChangedHandler = this.onAuthStateChangedHandler.filter(
      (element) => element !== changed_func
    );
  }

  isLogged() {
    return this.user !== null;
  }

  login(function_good, function_error) {
    var provider = new firebase.auth.GithubAuthProvider();
    provider.addScope("gist");

    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        var token = result.credential.accessToken;
        this.user = result.user;
        localStorage.setItem("accessToken", token);
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
        console.log(
          errorCode + "//" + errorMessage + "//" + email + "//" + credential
        );
        if (
          errorCode === "auth/popup-closed-by-user" ||
          errorCode === "auth/popup-blocked"
        ) {
          firebase.auth().signInWithRedirect(provider);
        }
      });
  }

  logout() {
    firebase.auth().signOut();
  }

  createGist() {
    var data = JSON.stringify({
      description: "MyPodcastTest",
      public: false,
      files: { "podcasts.json": { content: "[]" } },
    });

    var config = {
      method: "post",
      url: "https://api.github.com/gists",
      headers: {
        Authorization: "token " + localStorage.getItem("accessToken"),
        "Content-Type": "application/json",
      },
      data: data,
    };

    axios(config)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  updateGist(podcasts) {
    const octokit = new Octokit({ auth: localStorage.getItem("accessToken") });
    if (!this.gist) {
      octokit
        .request("PATCH /gists/{gist_id}", {
          gist_id: this.gist.id,
          files: {
            "podcasts.json": { content: JSON.stringify({ test: null }) },
          },
        })
        .then(
          function (result) {
            this.gists = result.data;
            console.log(this.gists);
            this.getRaw();
          }.bind(this)
        );
    }
  }
}
