#! /usr/bin/env node

const fs = require("fs");
const clear = require("clear");
const figlet = require("figlet");
const ora = require("ora");
const chalk = require("chalk");
const Prompt = require("prompt-checkbox");
const axios = require("axios");

const packageDeps = require("./availableDeps.json");
const downloadGist = require("./downloadGist");
const runCommand = require("./runCommand");

const prompt = new Prompt({
  name: "packages",
  message: "Do you want any third-party library ? \n(press space to choose, enter to confirm)\n",
  choices: ["react-router", "redux", "recoil", "prop-types"],
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

  await runCommand("npm", ["install", ...packages.flatMap((p) => p.pack)], {
    cwd: process.cwd() + "/" + name,
  });

  const gists = await downloadGist(
    "https://api.github.com/users/Karnak19/gists",
    packages.map((p) => p.id)
  );

  const files = gists.flatMap((gist) => {
    return Object.values(gist).map((val) => {
      return {
        promise: axios.get(val.raw_url),
      };
    });
  });

  const res = await Promise.all(files.map((f) => f.promise));

  res.forEach((f) => {
    filename = f.request.path.split("/")[5];
    fs.writeFile(`${process.cwd()}/${name}/src/${filename}`, f.data, (err) => {
      if (err) throw err;
    });
  });

  spinner.stop();
  promptEnd();
})();

function colorlog(text, color) {
  return console.log(color(text));
}
