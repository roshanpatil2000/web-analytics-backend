import { Response } from 'express';
import { successResponse, errorResponse } from '../responseHandler';
import { SuccessResponseBody, ErrorResponseBody } from '../types';

describe('responseHandler', () => {
  describe('successResponse', () => {
    let mockResponse: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
      jsonMock = jest.fn();
      statusMock = jest.fn().mockReturnValue({ json: jsonMock });
      mockResponse = {
        status: statusMock,
      } as Partial<Response>;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return a successful response with default parameters', () => {
      successResponse(mockResponse as Response, 'Success', {});

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
      });
    });

    it('should return a successful response with custom message', () => {
      const customMessage = 'Operation completed successfully';
      successResponse(mockResponse as Response, customMessage, {});

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: customMessage,
      });
    });

    it('should return a successful response with data object', () => {
      const data = { user: { id: 1, name: 'John Doe' }, count: 10 };
      successResponse(mockResponse as Response, 'User retrieved', data);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'User retrieved',
        user: { id: 1, name: 'John Doe' },
        count: 10,
      });
    });

    it('should return a successful response with custom status code', () => {
      successResponse(mockResponse as Response, 'Resource created', {}, 201);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Resource created',
      });
    });

    it('should handle empty data object', () => {
      successResponse(mockResponse as Response, 'Success', {});

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
      });
    });

    it('should spread data properties into response', () => {
      const data = {
        items: [1, 2, 3],
        total: 3,
        page: 1,
      };
      successResponse(mockResponse as Response, 'Items retrieved', data);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Items retrieved',
        items: [1, 2, 3],
        total: 3,
        page: 1,
      });
    });

    it('should handle nested objects in data', () => {
      const data = {
        user: {
          profile: {
            name: 'Jane',
            age: 30,
          },
        },
      };
      successResponse(mockResponse as Response, 'Profile loaded', data);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Profile loaded',
        user: {
          profile: {
            name: 'Jane',
            age: 30,
          },
        },
      });
    });

    it('should handle arrays in data', () => {
      const data = {
        results: ['item1', 'item2', 'item3'],
      };
      successResponse(mockResponse as Response, 'Search complete', data);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Search complete',
        results: ['item1', 'item2', 'item3'],
      });
    });

    it('should handle boolean values in data', () => {
      const data = {
        isActive: true,
        isVerified: false,
      };
      successResponse(mockResponse as Response, 'Status checked', data);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Status checked',
        isActive: true,
        isVerified: false,
      });
    });

    it('should handle null values in data', () => {
      const data = {
        deletedAt: null,
        lastLogin: null,
      };
      successResponse(mockResponse as Response, 'User data', data);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'User data',
        deletedAt: null,
        lastLogin: null,
      });
    });

    it('should handle numeric values in data', () => {
      const data = {
        count: 42,
        price: 99.99,
        discount: 0,
      };
      successResponse(mockResponse as Response, 'Pricing info', data);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Pricing info',
        count: 42,
        price: 99.99,
        discount: 0,
      });
    });

    it('should use default message when not provided', () => {
      successResponse(mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
      });
    });

    it('should handle 204 status code', () => {
      successResponse(mockResponse as Response, 'No content', {}, 204);

      expect(statusMock).toHaveBeenCalledWith(204);
    });

    it('should handle 201 Created status', () => {
      const data = { id: 123, name: 'New Resource' };
      successResponse(mockResponse as Response, 'Created', data, 201);

      expect(statusMock).toHaveBeenCalledWith(201);
      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Created',
        id: 123,
        name: 'New Resource',
      });
    });

    it('should handle 202 Accepted status', () => {
      successResponse(mockResponse as Response, 'Accepted', {}, 202);

      expect(statusMock).toHaveBeenCalledWith(202);
    });

    it('should handle special characters in message', () => {
      const message = "Success! User's data retrieved @2024";
      successResponse(mockResponse as Response, message, {});

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: message,
      });
    });

    it('should handle very long messages', () => {
      const longMessage = 'a'.repeat(1000);
      successResponse(mockResponse as Response, longMessage, {});

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: longMessage,
      });
    });

    it('should handle data with many properties', () => {
      const data: Record<string, unknown> = {};
      for (let i = 0; i < 100; i++) {
        data[`prop${i}`] = i;
      }
      successResponse(mockResponse as Response, 'Large data', data);

      expect(statusMock).toHaveBeenCalledWith(200);
      expect(jsonMock).toHaveBeenCalled();
    });

    it('should return the response object for chaining', () => {
      const result = successResponse(mockResponse as Response, 'Test', {});

      expect(result).toBeDefined();
      expect(result).toHaveProperty('status');
    });

    it('should handle data with undefined values', () => {
      const data = {
        name: 'Test',
        value: undefined,
      };
      successResponse(mockResponse as Response, 'Test', data);

      expect(jsonMock).toHaveBeenCalledWith({
        success: true,
        message: 'Test',
        name: 'Test',
        value: undefined,
      });
    });
  });

  describe('errorResponse', () => {
    let mockResponse: Partial<Response>;
    let statusMock: jest.Mock;
    let jsonMock: jest.Mock;

    beforeEach(() => {
      jsonMock = jest.fn();
      statusMock = jest.fn().mockReturnValue({ json: jsonMock });
      mockResponse = {
        status: statusMock,
      } as Partial<Response>;
    });

    afterEach(() => {
      jest.clearAllMocks();
    });

    it('should return an error response with default parameters', () => {
      errorResponse(mockResponse as Response);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 500,
        error: {},
      });
    });

    it('should return an error response with custom error object', () => {
      const error = { message: 'Something went wrong' };
      errorResponse(mockResponse as Response, error);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 500,
        error: { message: 'Something went wrong' },
      });
    });

    it('should return an error response with custom status code', () => {
      const error = { message: 'Not found' };
      errorResponse(mockResponse as Response, error, 404);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 404,
        error: { message: 'Not found' },
      });
    });

    it('should handle 400 Bad Request', () => {
      const error = { message: 'Invalid input', field: 'email' };
      errorResponse(mockResponse as Response, error, 400);

      expect(statusMock).toHaveBeenCalledWith(400);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 400,
        error: { message: 'Invalid input', field: 'email' },
      });
    });

    it('should handle 401 Unauthorized', () => {
      const error = { message: 'Authentication required' };
      errorResponse(mockResponse as Response, error, 401);

      expect(statusMock).toHaveBeenCalledWith(401);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 401,
        error: { message: 'Authentication required' },
      });
    });

    it('should handle 403 Forbidden', () => {
      const error = { message: 'Access denied' };
      errorResponse(mockResponse as Response, error, 403);

      expect(statusMock).toHaveBeenCalledWith(403);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 403,
        error: { message: 'Access denied' },
      });
    });

    it('should handle 404 Not Found', () => {
      const error = { message: 'Resource not found' };
      errorResponse(mockResponse as Response, error, 404);

      expect(statusMock).toHaveBeenCalledWith(404);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 404,
        error: { message: 'Resource not found' },
      });
    });

    it('should handle 409 Conflict', () => {
      const error = { message: 'Resource already exists' };
      errorResponse(mockResponse as Response, error, 409);

      expect(statusMock).toHaveBeenCalledWith(409);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 409,
        error: { message: 'Resource already exists' },
      });
    });

    it('should handle 422 Unprocessable Entity', () => {
      const error = {
        message: 'Validation failed',
        errors: [
          { field: 'email', message: 'Invalid email' },
          { field: 'password', message: 'Too weak' },
        ],
      };
      errorResponse(mockResponse as Response, error, 422);

      expect(statusMock).toHaveBeenCalledWith(422);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 422,
        error,
      });
    });

    it('should handle 500 Internal Server Error', () => {
      const error = { message: 'Internal server error' };
      errorResponse(mockResponse as Response, error, 500);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 500,
        error: { message: 'Internal server error' },
      });
    });

    it('should handle 503 Service Unavailable', () => {
      const error = { message: 'Service temporarily unavailable' };
      errorResponse(mockResponse as Response, error, 503);

      expect(statusMock).toHaveBeenCalledWith(503);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 503,
        error: { message: 'Service temporarily unavailable' },
      });
    });

    it('should handle error with stack trace', () => {
      const error = {
        message: 'Error occurred',
        stack: 'Error: at line 10...',
      };
      errorResponse(mockResponse as Response, error, 500);

      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 500,
        error,
      });
    });

    it('should handle error with nested objects', () => {
      const error = {
        message: 'Database error',
        details: {
          query: 'SELECT * FROM users',
          code: 'ER_DUP_ENTRY',
        },
      };
      errorResponse(mockResponse as Response, error, 500);

      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 500,
        error,
      });
    });

    it('should handle empty error object', () => {
      errorResponse(mockResponse as Response, {}, 500);

      expect(statusMock).toHaveBeenCalledWith(500);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 500,
        error: {},
      });
    });

    it('should handle error with code property', () => {
      const error = {
        code: 'ERR_USER_NOT_FOUND',
        message: 'User does not exist',
      };
      errorResponse(mockResponse as Response, error, 404);

      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 404,
        error,
      });
    });

    it('should handle error with timestamp', () => {
      const error = {
        message: 'Error occurred',
        timestamp: new Date().toISOString(),
      };
      errorResponse(mockResponse as Response, error, 500);

      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 500,
        error,
      });
    });

    it('should handle error with array of errors', () => {
      const error = {
        message: 'Multiple validation errors',
        errors: ['Email is required', 'Password is too short'],
      };
      errorResponse(mockResponse as Response, error, 400);

      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 400,
        error,
      });
    });

    it('should handle error with numeric properties', () => {
      const error = {
        message: 'Rate limit exceeded',
        retryAfter: 60,
        limit: 100,
        remaining: 0,
      };
      errorResponse(mockResponse as Response, error, 429);

      expect(statusMock).toHaveBeenCalledWith(429);
      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 429,
        error,
      });
    });

    it('should handle error with boolean flags', () => {
      const error = {
        message: 'Operation failed',
        isRetryable: true,
        isPermanent: false,
      };
      errorResponse(mockResponse as Response, error, 500);

      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 500,
        error,
      });
    });

    it('should return the response object for chaining', () => {
      const result = errorResponse(mockResponse as Response, {}, 500);

      expect(result).toBeDefined();
      expect(result).toHaveProperty('status');
    });

    it('should handle very detailed error object', () => {
      const error = {
        message: 'Complex error',
        type: 'ValidationError',
        code: 'VALIDATION_FAILED',
        statusCode: 400,
        details: {
          fields: [
            { name: 'email', error: 'Invalid format' },
            { name: 'age', error: 'Must be positive' },
          ],
        },
        timestamp: '2024-01-01T00:00:00Z',
        path: '/api/users',
        method: 'POST',
      };
      errorResponse(mockResponse as Response, error, 400);

      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 400,
        error,
      });
    });

    it('should handle null values in error object', () => {
      const error = {
        message: 'Error',
        data: null,
        user: null,
      };
      errorResponse(mockResponse as Response, error, 500);

      expect(jsonMock).toHaveBeenCalledWith({
        success: false,
        status: 500,
        error,
      });
    });
  });

  describe('Type conformance', () => {
    it('successResponse should conform to SuccessResponseBody type', () => {
      const jsonMock = jest.fn();
      const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
      const mockResponse = {
        status: statusMock,
      } as Partial<Response>;

      successResponse(mockResponse as Response, 'Test', { data: 'test' });

      const calledWith = jsonMock.mock.calls[0][0];
      expect(calledWith).toHaveProperty('success', true);
      expect(calledWith).toHaveProperty('message');
      expect(typeof calledWith.message).toBe('string');
    });

    it('errorResponse should conform to ErrorResponseBody type', () => {
      const jsonMock = jest.fn();
      const statusMock = jest.fn().mockReturnValue({ json: jsonMock });
      const mockResponse = {
        status: statusMock,
      } as Partial<Response>;

      errorResponse(mockResponse as Response, { message: 'Error' }, 500);

      const calledWith = jsonMock.mock.calls[0][0];
      expect(calledWith).toHaveProperty('success', false);
      expect(calledWith).toHaveProperty('status');
      expect(typeof calledWith.status).toBe('number');
      expect(calledWith).toHaveProperty('error');
      expect(typeof calledWith.error).toBe('object');
    });
  });
});