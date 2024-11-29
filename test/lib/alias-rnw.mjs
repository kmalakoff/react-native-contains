export async function resolve(specifier, context, next) {
  if (specifier === 'react-native') specifier = 'react-native-web';
  return next(specifier, context);
}
export async function load(url, context, next) {
  return next(url, context);
}
