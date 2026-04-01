'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
exports.AppError = exports.ErrorCode = void 0;
var ErrorCode;
(function (ErrorCode) {
  ErrorCode['DUPLICATE_CATEGORY'] = 'DUPLICATE_CATEGORY';
  ErrorCode['VALIDATION_ERROR'] = 'VALIDATION_ERROR';
  ErrorCode['CATEGORY_ID_EXISTS_GLOBAL'] = 'CATEGORY_ID_EXISTS_GLOBAL';
  // Add more codes as needed
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
// Shared error class for backend/frontend
class AppError extends Error {
  constructor(code, status = 400, message) {
    super(message || code);
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
exports.AppError = AppError;
