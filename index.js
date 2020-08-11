#! /usr/bin/env node

const clear = require("clear");
const figlet = require("figlet");
const ora = require("ora");
const chalk = require("chalk");
const Prompt = require("prompt-checkbox");
const downloadGist = require("./downloadGist");
const runCommand = require("./runCommand");
const axios = require("axios");

const prompt = new Prompt({
  name: "packages",
  message: "Do you want any third-party library ? \n(press space to choose, enter to confirm)\n",
  choices: ["react-router", "redux", "recoil"],
});
const name = process.argv[2];

clear();

const promptHeader = () =>
  console.log(
    chalk.yellow(
      figlet.textSync("create-react-rover", {
        horizontalLayout: "fitted",
      })
    )
  );
const promptEnd = () => {
  colorlog("Success ! 🔥", chalk.green);
  console.log("");
  console.log("");
  colorlog("Getting started :", chalk.yellow);
  console.log("");
  colorlog(`  cd ${name}`, chalk.cyan);
  colorlog("  npm run dev", chalk.cyan);
  console.log("");
};

if (!name || name.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
  return console.log(`
  ${chalk.red("Invalid directory name.")}
  Usage: create-express-api name-of-api  
`);
}

promptHeader();

const repoURL = "https://github.com/Karnak19/react-caprover-template.git";

let spinner;

const packageDeps = {
  "react-router": { packages: ["react-router-dom"], id: "e98ca3712bdaa650ce1cf625aa90e495" },
  redux: { packages: ["redux", "react-redux"], id: "" },
  recoil: { packages: ["recoil"], id: "" },
  "prop-types": { packages: ["prop-types"], id: "" },
};

(async () => {
  const answers = await prompt.run();
  const packages = answers.flatMap((answer) => {
    return { pack: packageDeps[answer].packages, id: packageDeps[answer].id };
  });
  await runCommand("git", ["clone", repoURL, name]);
  await runCommand("rm", ["-rf", `${name}/.git`]);
  spinner = ora("Installing dependencies...").start();

  await runCommand("npm", ["install"], {
    cwd: process.cwd() + "/" + name,
  });
  await runCommand("npm", ["install", packages.map((p) => p.pack)], {
    cwd: process.cwd() + "/" + name,
  });

  // TODO: Write the files from gist into the project folder

  spinner.stop();
  promptEnd();
})();

// prompt
//   .run()
//   .then((answers) => {})
//   .then(() => {})
//   .then(() => {})
//   .then(() => {})
// .then(() => {
//   return downloadGist(
//     "https://api.github.com/users/Karnak19/gists",
//     packages.map((p) => p.id)
//   );
// })
// .then((gists) => {
//   // TODO: write to files
//   const files = gists.map((gist) => {
//     Object.entries(gist).map(([key, value]) => {
//       return {
//         fileName: key,
//         url: value.raw_url,
//       };
//     });
//   });
//   console.log(files);

//   return Promise.all(
//     files.map((file) => {
//       return axios.get(file.url);
//     })
//   );
// })
// .then((values) => {
//   const data = values.map((x) => x.data);
//   console.log(data);
// })
// .then(() => {
// clear();
// });

function colorlog(text, color) {
  return console.log(color(text));
}
