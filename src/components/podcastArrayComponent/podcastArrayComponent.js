import React, { Component } from "react";

import axios from "axios";
import { Octokit } from "@octokit/core";

import GithubConnector from "../../githubConnector";

class PodcastArrayComponent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpened: false,
      connector: GithubConnector.getInstance(),
      gist: null,
      podcasts: null,
      beforeUpdatePodcasts: null,
      edit: false,
      save: false,
      get: false,
    };

    this.login = this.login.bind(this);
    this.logout = this.logout.bind(this);

    this.getGist = this.getGist.bind(this);
    this.createGist = this.createGist.bind(this);

    this.onAuthStateChanged = this.onAuthStateChanged.bind(this);

    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
  }
  componentDidMount() {
    this.state.connector.onAuthStateChanged(this.onAuthStateChanged);
    if (!this.props.podcasts) {
      try {
        this.getGist();
      } catch (error) {
        throw new error();
      }
    }
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

  getGist() {
    axios
      .get("https://api.github.com/gists", {
        params: {
          per_page: 100,
        },
        headers: {
          Authorization: `token ${localStorage.getItem("accessToken")}`,
          "User-Agent": "mypodcast-web",
        },
      })
      .then(
        function (result) {
          let gists = result.data;

          // console.log(gists);
          for (let i in gists) {
            if (gists[i].description === "MyPodcast") {
              console.log(gists[i]);
              this.setState(
                { gist: gists[i] },
                function () {
                  axios
                    .get(this.state.gist.files["podcasts.json"].raw_url)
                    .then(
                      function (result) {
                        this.setState({ podcasts: result.data });
                      }.bind(this)
                    );
                }.bind(this)
              );
            }
          }
          // console.log(this.state.podcasts);
          this.setState({ get: true });
        }.bind(this)
      );
  }

  createGist() {
    var data = JSON.stringify({
      description: "MyPodcast",
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
      .then(
        function (response) {
          this.setState(
            { gist: response.data },
            function () {
              axios.get(this.state.gist.files["podcasts.json"].raw_url).then(
                function (result) {
                  this.setState({ podcasts: result.data });
                }.bind(this)
              );
            }.bind(this)
          );
        }.bind(this)
      )
      .catch(function (error) {
        console.log(error);
      });
  }

  handlePodcastsUpdate(id, editedPodcast) {
    const { podcasts } = this.state;
    // console.log(editedPodcast);
    const newPodcasts = podcasts.map((podcast, index) => {
      if (index === id) {
        podcast = editedPodcast;
      }
      return podcast;
    });

    this.setState({ podcasts: newPodcasts, save: true });
  }

  handleSave() {
    const octokit = new Octokit({ auth: localStorage.getItem("accessToken") });
    if (this.state.gist) {
      octokit
        .request("PATCH /gists/{gist_id}", {
          gist_id: this.state.gist.id,
          files: {
            "podcasts.json": { content: JSON.stringify(this.state.podcasts) },
          },
        })
        .then(
          function (result) {
            this.setState({ save: false });
          }.bind(this)
        );
    }
  }

  handleEdit() {
    this.setState({ edit: !this.state.edit });
  }
  handleAddNewLine() {
    let podcasts = this.state.podcasts;
    podcasts.push({
      id: null,
      name: null,
      author: null,
      synopsis: null,
      img: null,
      state: "not_read",
      offset: 0,
      lastOpen: null,
      url: null,
    });
    this.setState({ podcasts: podcasts, save: true });
  }

  handleDel(id) {
    let upPodcasts = this.state.podcasts;
    upPodcasts.splice(id, 1);
    this.setState(
      { podcasts: upPodcasts, save: true, edit: !this.state.edit },
      this.handleEdit.bind(this)
    );
  }

  render() {
    console.log("render");
    return (
      <div>
        {this.state.save ? (
          <button onClick={this.handleSave.bind(this)}>Save</button>
        ) : (
          ""
        )}
        <button onClick={this.handleEdit.bind(this)}>
          {this.state.edit ? "Visualiser" : "Editer"}
        </button>
        {this.state.edit ? (
          <button onClick={this.handleAddNewLine.bind(this)}>Ajouter</button>
        ) : (
          ""
        )}
        {this.state.gist ? (
          this.state.podcasts ? (
            <table className="podcasts__array">
              <thead>
                <tr>
                  <th>id</th>
                  <th>Name</th>
                  <th>Author</th>
                  <th>Synopsis</th>
                  <th>Image</th>
                  <th>State</th>
                  <th>Offset</th>
                  <th>Last-Open</th>
                  <th>Url</th>
                </tr>
              </thead>
              <tbody>
                {this.state.podcasts
                  ? this.state.podcasts.map((podcast, id) =>
                      this.state.edit ? (
                        <TableRowForm
                          key={id}
                          data={podcast}
                          id={id}
                          handlePodcastsUpdate={this.handlePodcastsUpdate.bind(
                            this
                          )}
                          handleDel={this.handleDel.bind(this)}
                        />
                      ) : (
                        <TableRow
                          key={id}
                          data={podcast}
                          id={id}
                          handlePodcastsUpdate={this.handlePodcastsUpdate.bind(
                            this
                          )}
                        />
                      )
                    )
                  : "loading"}
              </tbody>
            </table>
          ) : (
            "loading"
          )
        ) : this.state.get ? (
          <div>
            <h1>pas de gist trouvé il faut en crée un </h1>
            <button onClick={this.createGist}>Créer</button>
          </div>
        ) : (
          "loading"
        )}
      </div>
    );
  }
}

class TableRowForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      podcast: this.props.data,
    };
  }

  handleChange = (id, podcast) => {
    this.props.handlePodcastsUpdate(id, podcast);
  };

  handleDel = () => {
    this.props.handleDel(this.state.id);
  };

  handleNameChange = (e) => {
    let newPodcasts = this.state.podcast;
    newPodcasts.name = e.target.value;
    let id = newPodcasts.name.replace(/\s/g, "_").toLowerCase();
    newPodcasts.id = id;
    this.handleChange(this.state.id, newPodcasts);
  };

  handleAuthorChange = (e) => {
    let newPodcasts = this.state.podcast;
    newPodcasts.author = e.target.value;
    this.handleChange(this.state.id, newPodcasts);
  };

  handleSynopsisChange = (e) => {
    let newPodcasts = this.state.podcast;
    newPodcasts.synopsis = e.target.value;
    this.handleChange(this.state.id, newPodcasts);
  };

  handleImageChange = (e) => {
    let newPodcasts = this.state.podcast;
    newPodcasts.img = e.target.value;
    this.handleChange(this.state.id, newPodcasts);
  };

  handleStateChange = (e) => {
    let newPodcasts = this.state.podcast;
    newPodcasts.state = e.target.value;
    this.handleChange(this.state.id, newPodcasts);
  };

  handleOffsetChange = (e) => {
    let newPodcasts = this.state.podcast;
    newPodcasts.offset = e.target.value;
    this.handleChange(this.state.id, newPodcasts);
  };

  handleLastOpenChange = (e) => {
    let newPodcasts = this.state.podcast;
    newPodcasts.lastOpen = e.target.value;
    this.handleChange(this.state.id, newPodcasts);
  };

  handleUrlChange = (e) => {
    let newPodcasts = this.state.podcast;
    newPodcasts.url = e.target.value;
    this.handleChange(this.state.id, newPodcasts);
  };

  render() {
    // console.log(this.props);
    // const {
    //   data: { id, name, author, synopsis, mage, state, offset, lastopen, url },
    // } = this.props;

    return (
      <tr>
        <td>{this.props.id}</td>
        <td>
          <input
            type="text"
            value={this.state.podcast.name}
            onChange={this.handleNameChange}
          />
        </td>
        <td>
          <input
            type="text"
            value={this.state.podcast.author}
            onChange={this.handleAuthorChange}
          />
        </td>
        <td>
          <input
            type="text"
            value={this.state.podcast.synopsis}
            onChange={this.handleSynopsisChange}
          />
        </td>
        <td>
          <input
            type="text"
            value={this.state.podcast.img}
            onChange={this.handleImageChange}
          />
        </td>
        <td>
          <input
            type="text"
            value={this.state.podcast.state}
            onChange={this.handleStateChange}
          />
        </td>
        <td>
          <input
            type="text"
            value={this.state.podcast.offset}
            onChange={this.handleOffsetChange}
          />
        </td>
        <td>
          <input
            type="text"
            value={this.state.podcast.lastOpen}
            onChange={this.handleLastOpenChange}
          />
        </td>
        <td>
          <input
            type="text"
            value={this.state.podcast.url}
            onChange={this.handleUrlChange}
          />
        </td>
        <button onClick={this.handleDel.bind(this)}>DEL</button>
      </tr>
    );
  }
}

class TableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: this.props.id,
      podcast: this.props.data,
    };
  }

  render() {
    // console.log(this.props);
    // const {
    //   data: { id, name, author, synopsis, mage, state, offset, lastopen, url },
    // } = this.props;

    return (
      <tr>
        <td>{this.props.id}</td>
        <td>{this.state.podcast.name}</td>
        <td>{this.state.podcast.author}</td>
        <td>{this.state.podcast.synopsis}</td>
        <td>{this.state.podcast.img}</td>
        <td>{this.state.podcast.state}</td>
        <td>{this.state.podcast.offset}</td>
        <td>{this.state.podcast.lastOpen}</td>
        <td>{this.state.podcast.url}</td>
      </tr>
    );
  }
}

export default PodcastArrayComponent;
