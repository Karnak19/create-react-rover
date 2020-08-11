const axios = require("axios");

async function downloadGist(url, ids) {
  try {
    const res = await axios.get(url, {
      headers: {
        "User-Agent": "curl/7.30.0",
        Host: "api.github.com",
        Accept: "*/*",
      },
    });

    return res.data
      .filter((gist) => ids.some((id) => id === gist.id))
      .map((e) => {
        return e.files;
      });
  } catch (error) {
    console.log(error.message);
  }
}

// downloadGist("https://api.github.com/users/Karnak19/gists", ["e98ca3712bdaa650ce1cf625aa90e495"]).then((e) => console.log(e));

module.exports = downloadGist;
