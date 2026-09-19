process.env.REACT_TEST_PROFILE = 'current';
export default (await import('./wtr.config.mjs')).default;
