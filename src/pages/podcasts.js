import axios from "axios";
import React, { Component } from "react";

class Podcasts extends Component {
  constructor(props) {
    super(props);

    this.state = {
      podcasts: [],
    };
  }

  componentDidMount() {
    axios
      .get(
        "https://gist.githubusercontent.com/LeGmask/134e4361b752cfe71f4c7337d99a17bd/raw/4ed3f3f29e2aed8d0c6580ce91bc724eae3acb0e/podcasts.json"
      )
      .then((res) => {
        console.log(res.data);
        const podcasts = res.data;
        this.setState({ podcasts });
      });
  }

  render() {
    return (
      <div>
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
            {this.state.podcasts.map((podcast, id) => (
              <tr>
                <td>{id}</td>
                <td>{podcast.name}</td>
                <td>{podcast.author}</td>
                <td>{podcast.synopsis}</td>
                <td>{podcast.image}</td>
                <td>{podcast.state}</td>
                <td>{podcast.offset}</td>
                <td>{podcast.lastopen}</td>
                <td>{podcast.url}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Podcasts;
