/**
 * Simple async handler to wrap async route handlers
 * Catches any errors and passes them to the next middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
