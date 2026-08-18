const asyncHandler = require('../../utils/asyncHandler');

describe('asyncHandler', () => {
  test('calls the wrapped function normally on success', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();
    const fn = jest.fn().mockResolvedValue('ok');

    await asyncHandler(fn)(req, res, next);

    expect(fn).toHaveBeenCalledWith(req, res, next);
    expect(next).not.toHaveBeenCalled();
  });

  test('forwards errors to next on failure', async () => {
    const req = {};
    const res = {};
    const next = jest.fn();
    const error = new Error('failure');
    const fn = jest.fn().mockRejectedValue(error);

    await asyncHandler(fn)(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
