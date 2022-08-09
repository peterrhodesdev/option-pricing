const { execSync } = require("child_process");
const packageVersion = require("./package").version;

const npmVersion = execSync("npm view option-pricing version")
  .toString()
  .trim();

const COLOR_RED = "\x1b[31m";
const COLOR_RESET = "\x1b[0m";

if (packageVersion === npmVersion) {
  // eslint-disable-next-line no-console
  console.log(
    `${COLOR_RED}update package version before publishing${COLOR_RESET}`
  );
  process.exit(1);
}
