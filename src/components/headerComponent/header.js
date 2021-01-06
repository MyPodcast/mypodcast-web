import React, { Component } from "react";
import GithubConnector from "../../githubConnector";
import {
  Header as JHeader,
  HeaderLinks,
  HeaderLink,
  HeaderLogo,
  HeaderSeparator,
  HeaderSpacer,
  HeaderHamburger,
  HeaderAccount,
} from "@quentinguidee/react-jade-ui";
import "./header.scss";

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: false,
      connector: GithubConnector.getInstance(),
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.toggleHamburger = this.toggleHamburger.bind(this);
    this.closeHamburger = this.closeHamburger.bind(this);

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

  toggleHamburger() {
    this.setState({ isOpened: !this.state.isOpened });
  }

  closeHamburger() {
    this.setState({ isOpened: false });
  }

  render() {
    let isLogged = this.state.connector.isLogged();

    let messages = {
      mypodcast: "MyPodcast",
      podcasts: "podcasts",
      gitHub: "Github",
      login: "Login",
      logout: "Logout",
    };

    return (
      <JHeader isOpened={this.state.isOpened} className="header">
        <HeaderLogo onClick={this.closeHamburger} className="logo">
          {messages.mypodcast}
        </HeaderLogo>
        <HeaderSpacer />
        <HeaderLinks>
          <HeaderLink
            onClick={this.closeHamburger}
            to="/podcasts"
            hide={!isLogged}
          >
            {messages.podcasts}
          </HeaderLink>
          <HeaderLink
            href="https://github.com/legmask/mypodcast"
            icon="open_in_new"
            isExternalLink
          >
            {messages.gitHub}
          </HeaderLink>
          <HeaderSeparator />
          <HeaderLink onClick={this.login} hide={isLogged}>
            {messages.login}
          </HeaderLink>
          <HeaderLink onClick={this.logout} hide={!isLogged} red>
            {messages.logout}
          </HeaderLink>
          <HeaderAccount
            username={
              !isLogged ? undefined : this.state.connector.getUserName()
            }
            image={!isLogged ? "" : this.state.connector.getUserPhotoURL()}
            hide={!isLogged}
          />
        </HeaderLinks>
        <HeaderHamburger onClick={this.toggleHamburger} />
      </JHeader>
    );
  }
}
