#! /usr/bin/env node

const { spawn } = require("child_process");
const clear = require("clear");
const figlet = require("figlet");
const ora = require("ora");
const chalk = require("chalk");

clear();

const promptHeader = () =>
  console.log(
    chalk.yellow(
      figlet.textSync("create-react-rover", {
        horizontalLayout: "fitted",
      })
    )
  );

const name = process.argv[2];
if (!name || name.match(/[<>:"\/\\|?*\x00-\x1F]/)) {
  return console.log(`
  ${chalk.red("Invalid directory name.")}
  Usage: create-express-api name-of-api  
`);
}

promptHeader();

const repoURL = "https://github.com/Karnak19/react-caprover-template.git";
let spinner;
runCommand("git", ["clone", repoURL, name])
  .then(() => {
    return runCommand("rm", ["-rf", `${name}/.git`]);
  })
  .then(() => {
    spinner = ora("Installing dependencies...").start();

    return runCommand("npm", ["install"], {
      cwd: process.cwd() + "/" + name,
    });
  })
  .then(() => {
    // clear();
    spinner.stop();
    // promptHeader();
    colorlog("Success ! 🔥", chalk.green);
    console.log("");
    console.log("");
    colorlog("Getting started", chalk.yellow);
    console.log("");
    colorlog(`  cd ${name}`, chalk.cyan);
    colorlog("  npm run dev", chalk.cyan);
  });

function runCommand(command, args, options = undefined) {
  const spawned = spawn(command, args, options);

  return new Promise((resolve) => {
    spawned.stderr.on("data", (data) => {
      console.error(data.toString());
    });

    spawned.on("close", () => {
      resolve();
    });
  });
}

function colorlog(text, color) {
  return console.log(color(text));
}
