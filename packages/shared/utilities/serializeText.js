'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.serializeText = void 0;
const serializeText = (label) => {
  return label
    .trim() // Remove leading/trailing whitespace
    .toLowerCase() // Convert to lowercase
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric characters with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading or trailing hyphens
};
exports.serializeText = serializeText;
