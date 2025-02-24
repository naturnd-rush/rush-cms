// env.ts
// Imports environment variables with config options using ES6 as required by eslint settings
// Add before other imports in main file: import './env.ts';
// per: https://stackoverflow.com/questions/64620877/cant-use-dotenv-with-es6-modules
import dotenv from "dotenv";
dotenv.config({ path: "../.env" });
