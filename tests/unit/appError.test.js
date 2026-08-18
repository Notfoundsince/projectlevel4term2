const AppError = require('../../utils/AppError');

describe('AppError', () => {
  test('creates an error with the given message and status code', () => {
    const error = new AppError('Something went wrong', 400);

    expect(error.message).toBe('Something went wrong');
    expect(error.statusCode).toBe(400);
    expect(error.isOperational).toBe(true);
  });

  test('is an instance of Error', () => {
    const error = new AppError('Failure case', 500);

    expect(error).toBeInstanceOf(Error);
    expect(error.statusCode).toBe(500);
  });
});
