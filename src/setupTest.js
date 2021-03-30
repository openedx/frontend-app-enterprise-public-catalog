import 'babel-polyfill';

// Fail tests if there are console errors
const { error } = global.console;

global.console.error = (...args) => {
  error(...args);
  throw new Error(args.join(' '));
};
