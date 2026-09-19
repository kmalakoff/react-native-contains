process.env.REACT_TEST_PROFILE = 'minimum';
export default (await import('./wtr.config.mjs')).default;
