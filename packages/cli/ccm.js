#!/usr/bin/env node

/* eslint-disable */

require("./main")
  .main(process.argv.slice(2))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
