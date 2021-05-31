// @flow

export const isRelativePathToDocumentationRoot = (path: string): boolean => {
  return path.startsWith('/');
};

export const isDocumentationAbsoluteUrl = (path: string): boolean => {
  return path.startsWith('http://') || path.startsWith('https://');
};

export const getHelpLink = (path: string): string => {
  if (isRelativePathToDocumentationRoot(path))
    return `http://wiki.compilgames.net/doku.php/gdevelop5${path}?utm_source=gdevelop&utm_medium=help-link`;

  if (isDocumentationAbsoluteUrl(path)) return path;

  return '';
};
