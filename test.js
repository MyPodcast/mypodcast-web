var axios = require("axios");
var data = JSON.stringify({ files: { "podcasts.json": { content: "null" } } });

var config = {
  method: "post",
  url: "https://api.github.com/gists",
  headers: {
    Authorization: "token ea1b48234e1a51533a9965139d901e49544517d3",
    "Content-Type": "application/json",
    Cookie: "_octo=GH1.1.1946709280.1609526112; logged_in=no",
  },
  data: data,
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
  })
  .catch(function (error) {
    console.log(error);
  });
