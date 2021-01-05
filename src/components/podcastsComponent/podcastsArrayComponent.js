import React, { Component } from "react";

class PodcastsArray extends Component {
  render() {
    return (
      <div>
        <table className="podcasts__array">
          <thead>
            <tr>
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
        </table>
      </div>
    );
  }
}

export default PodcastsArray;
