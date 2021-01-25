import React, { Component } from "react";

import axios from "axios";
import { Octokit } from "@octokit/core";
import GithubConnector from "../../githubConnector";

import {
  Button,
  IconButton,
  MenuItem,
  Select,
  TextField,
} from "@material-ui/core";
import { MdEdit, MdAdd, MdSave, MdDelete } from "react-icons/md";
import { VscOutput } from "react-icons/vsc";

import "./podcastArrayComponent.scss";

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
              // console.log(gists[i]);
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
      files: {
        "podcasts.json": {
          content: JSON.stringify([
            {
              id: "Kalimba-azdfvbnj",
              name: "Kalimba",
              author: "Kalimba",
              synopsis: "A default file, to discover the app",
              img:
                "https://d3t3ozftmdmh3i.cloudfront.net/production/podcast_uploaded_nologo400/6184229/6184229-1591646036842-0309ff2c8deed.jpg",
              state: "not_read",
              offset: 0,
              lastopen: null,
              url:
                "https://www.learningcontainer.com/wp-content/uploads/2020/02/Kalimba.mp3",
            },
          ]),
        },
      },
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
      lastopen: null,
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
    let isLogged = this.state.connector.isLogged();

    var showButtons = false;
    let buttons = (
      <div>
        {this.state.save ? (
          <IconButton
            onClick={this.handleSave.bind(this)}
            aria-label="Sauvegarder"
          >
            <MdSave />
          </IconButton>
        ) : (
          ""
        )}
        <>
          {this.state.edit ? (
            <>
              <IconButton
                onClick={this.handleEdit.bind(this)}
                aria-label="Visualiser"
              >
                <VscOutput />
              </IconButton>
              <IconButton
                onClick={this.handleAddNewLine.bind(this)}
                aria-label="Ajouter une ligne"
              >
                <MdAdd />
              </IconButton>
            </>
          ) : (
            <IconButton
              onClick={this.handleEdit.bind(this)}
              aria-label="Editer"
            >
              <MdEdit />
            </IconButton>
          )}
        </>
      </div>
    );

    let podcastsArray = <h1>loading</h1>;
    if (isLogged) {
      if (this.state.get) {
        // If gist doesn't exist
        if (!this.state.gist) {
          podcastsArray = (
            <>
              <h1>Pas de gist trouvé 🔍</h1>
              <Button
                onClick={this.createGist}
                variant="outlined"
                color="primary"
              >
                Créer
              </Button>
            </>
          );
        } else if (this.state.podcasts) {
          // were waiting the promise
          if (this.state.edit) {
            showButtons = true;
            podcastsArray = (
              <table className="podcasts__array__edit">
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Nom</th>
                    <th>Auteur</th>
                    <th>Résumé</th>
                    <th>Image</th>
                    <th>Etat</th>
                    <th>Avancement</th>
                    {/* <th>Last-Open</th> */}
                    <th>Url</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.podcasts.map((podcast, id) => (
                    <TableRowForm
                      key={id}
                      data={podcast}
                      id={id}
                      handlePodcastsUpdate={this.handlePodcastsUpdate.bind(
                        this
                      )}
                      handleDel={this.handleDel.bind(this)}
                    />
                  ))}
                </tbody>
              </table>
            );
          } else {
            showButtons = true;
            podcastsArray = (
              <table className="podcasts__array__view">
                <thead>
                  <tr>
                    <th>N°</th>
                    <th>Nom</th>
                    <th>Auteur</th>
                    <th>Résumé</th>
                    <th>Image</th>
                    <th>Etat</th>
                    <th>Avancement</th>
                    {/* <th>Last-Open</th> */}
                    <th>Url</th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.podcasts.map((podcast, id) => (
                    <TableRow
                      key={id}
                      data={podcast}
                      id={id}
                      handlePodcastsUpdate={this.handlePodcastsUpdate.bind(
                        this
                      )}
                    />
                  ))}
                </tbody>
              </table>
            );
          }
        }
      }
    } else {
      podcastsArray = (
        <>
          <h1>Vous n'êtes pas connecté 🔓 !</h1>
          <Button onClick={this.login} variant="outlined" color="primary">
            Se connecter
          </Button>
        </>
      );
    }

    return (
      <div>
        {showButtons ? buttons : ""}
        {podcastsArray}
        {showButtons ? buttons : ""}
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
    newPodcasts.lastopen = e.target.value;
    this.handleChange(this.state.id, newPodcasts);
  };

  handleUrlChange = (e) => {
    let newPodcasts = this.state.podcast;
    newPodcasts.url = e.target.value;
    this.handleChange(this.state.id, newPodcasts);
  };

  render() {
    return (
      <>
        <tr>
          <td>{this.props.id + 1}</td>
          <td>
            <TextField
              style={{ minWidth: "100px" }}
              id="standard-multiline-flexible"
              label="Nom"
              multiline
              // rowsMax={10}
              value={this.state.podcast.name}
              onChange={this.handleNameChange}
            />
          </td>
          <td>
            <TextField
              style={{ minWidth: "100px" }}
              id="standard-multiline-flexible"
              label="Auteur"
              multiline
              // rowsMax={10}
              value={this.state.podcast.author}
              onChange={this.handleAuthorChange}
            />
          </td>
          <td>
            <TextField
              style={{ minWidth: "200px" }}
              id="standard-multiline-flexible"
              label="Résumé"
              multiline
              // rowsMax={10}
              value={this.state.podcast.synopsis}
              onChange={this.handleSynopsisChange}
            />
          </td>
          <td>
            <TextField
              style={{ minWidth: "200px" }}
              id="standard-multiline-flexible"
              label="Image"
              multiline
              rowsMax={3}
              value={this.state.podcast.img}
              onChange={this.handleImageChange}
            />
          </td>
          <td>
            <Select
              labelId="demo-simple-select-error-label"
              id="demo-simple-select-error"
              value={this.state.podcast.state}
              onChange={this.handleStateChange}
              renderValue={(value) => stateToLang(value)}
            >
              <MenuItem value={"not_read"}>Nouveau</MenuItem>
              <MenuItem value={"in_read"}>Lecture</MenuItem>
              <MenuItem value={"read"}>Lu</MenuItem>
            </Select>
          </td>
          <td>
            <TextField
              style={{ minWidth: "100px" }}
              id="standard-multiline-flexible"
              label="Avancement"
              multiline
              // rowsMax={10}
              value={this.state.podcast.offset}
              onChange={this.handleOffsetChange}
            />
          </td>
          {/* <td>
            <input
              type="text"
              value={this.state.podcast.lastopen}
              onChange={this.handleLastOpenChange}
            />
          </td> */}
          <td>
            <TextField
              style={{ minWidth: "200px" }}
              id="standard-multiline-flexible"
              label="Url"
              multiline
              rowsMax={3}
              value={this.state.podcast.url}
              onChange={this.handleUrlChange}
            />
          </td>
          <td>
            <IconButton
              onClick={this.handleDel.bind(this)}
              aria-label="Supprimer"
            >
              <MdDelete />
            </IconButton>
          </td>
        </tr>
      </>
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
    return (
      <tr>
        <td>{this.props.id + 1}</td>
        <td>{this.state.podcast.name}</td>
        <td>{this.state.podcast.author}</td>
        <td>{this.state.podcast.synopsis}</td>
        <td>
          <img src={this.state.podcast.img} alt="cover" className="cover" />
        </td>
        <td>{stateToLang(this.state.podcast.state)}</td>
        <td>{this.state.podcast.offset}</td>
        {/* <td>{this.state.podcast.lastopen}</td> */}
        <td>
          <audio controls src={this.state.podcast.url}>
            Your browser does not support the
            <code>audio</code> element.
          </audio>
        </td>
      </tr>
    );
  }
}

function stateToLang(state) {
  switch (state) {
    case "not_read":
      return "Nouveau";
    case "in_read":
      return "Lecture";
    case "read":
      return "Lu";
    default:
      break;
  }
}

export default PodcastArrayComponent;
