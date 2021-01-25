import { Button } from "@material-ui/core";
import React, { Component } from "react";
import GithubConnector from "../githubConnector";

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      connector: GithubConnector.getInstance(),
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.onAuthStateChanged = this.onAuthStateChanged.bind(this);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }

  componentDidMount() {
    this.state.connector.onAuthStateChanged(this.onAuthStateChanged);
  }

  componentWillUnmount() {
    this.state.connector.removeAuthStateChanged(this.onAuthStateChanged);
  }

  onAuthStateChanged() {
    this.forceUpdate();
  }

  login() {
    this.state.connector.login();
  }

  logout() {
    this.state.connector.logout();
  }

  render() {
    let isLogged = this.state.connector.isLogged();

    return isLogged ? (
      <>
        <h1>Rendez vous sur l'onglet podcast pour editer vos podcast !</h1>
        <Button href="/podcast" variant="outlined" color="primary">
          Podcasts
        </Button>
      </>
    ) : (
      <>
        <h1>Vous n'êtes pas connecté 🔓 !</h1>
        <Button onClick={this.login} variant="outlined" color="primary">
          Se connecter
        </Button>
      </>
    );
  }
}
