import { SuccessResponseBody, ErrorResponseBody } from '../types';

describe('Response Types', () => {
  describe('SuccessResponseBody', () => {
    it('should allow valid success response structure', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'Operation successful',
      };

      expect(response.success).toBe(true);
      expect(response.message).toBe('Operation successful');
    });

    it('should allow success response with data property', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'Data retrieved',
        data: { id: 1, name: 'Test' },
      };

      expect(response.data).toEqual({ id: 1, name: 'Test' });
    });

    it('should allow success response without data property', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'Success',
      };

      expect(response.data).toBeUndefined();
    });

    it('should have success property as literal true', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'Test',
      };

      expect(response.success).toBe(true);
      // Type system ensures this is literally true, not just boolean
      const successValue: true = response.success;
      expect(successValue).toBe(true);
    });

    it('should accept empty string as message', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: '',
      };

      expect(response.message).toBe('');
    });

    it('should accept very long message', () => {
      const longMessage = 'a'.repeat(10000);
      const response: SuccessResponseBody = {
        success: true,
        message: longMessage,
      };

      expect(response.message).toBe(longMessage);
    });

    it('should accept special characters in message', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: '✓ Success! @#$%^&*()',
      };

      expect(response.message).toContain('✓');
    });

    it('should accept unicode characters in message', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: '成功 успех نجاح',
      };

      expect(response.message).toContain('成功');
    });

    it('should accept data with nested objects', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'Complex data',
        data: {
          user: {
            profile: {
              name: 'John',
              address: {
                city: 'NYC',
              },
            },
          },
        },
      };

      expect(response.data).toHaveProperty('user');
    });

    it('should accept data with arrays', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'List retrieved',
        data: {
          items: [1, 2, 3, 4, 5],
          count: 5,
        },
      };

      expect(Array.isArray(response.data?.items)).toBe(true);
    });

    it('should accept data with null values', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'Data with nulls',
        data: {
          value: null,
          optional: null,
        },
      };

      expect(response.data?.value).toBeNull();
    });

    it('should accept data with undefined values', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'Data with undefined',
        data: {
          value: undefined,
          missing: undefined,
        },
      };

      expect(response.data?.value).toBeUndefined();
    });

    it('should accept data with boolean values', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'Boolean data',
        data: {
          isActive: true,
          isDeleted: false,
        },
      };

      expect(response.data?.isActive).toBe(true);
    });

    it('should accept data with numeric values', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'Numeric data',
        data: {
          count: 42,
          price: 99.99,
          negative: -10,
          zero: 0,
        },
      };

      expect(response.data?.count).toBe(42);
    });

    it('should accept data with string values', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'String data',
        data: {
          name: 'Test',
          empty: '',
          multiline: 'line1\nline2',
        },
      };

      expect(response.data?.name).toBe('Test');
    });

    it('should accept data with mixed types', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'Mixed data',
        data: {
          string: 'text',
          number: 123,
          boolean: true,
          null: null,
          array: [1, 2, 3],
          object: { key: 'value' },
        },
      };

      expect(typeof response.data?.string).toBe('string');
      expect(typeof response.data?.number).toBe('number');
      expect(typeof response.data?.boolean).toBe('boolean');
    });

    it('should accept empty data object', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'Empty data',
        data: {},
      };

      expect(Object.keys(response.data || {}).length).toBe(0);
    });

    it('should accept data with Date objects', () => {
      const now = new Date();
      const response: SuccessResponseBody = {
        success: true,
        message: 'Date data',
        data: {
          timestamp: now,
        },
      };

      expect(response.data?.timestamp).toBeInstanceOf(Date);
    });

    it('should accept data with RegExp objects', () => {
      const pattern = /test/i;
      const response: SuccessResponseBody = {
        success: true,
        message: 'Pattern data',
        data: {
          pattern: pattern,
        },
      };

      expect(response.data?.pattern).toBeInstanceOf(RegExp);
    });
  });

  describe('ErrorResponseBody', () => {
    it('should allow valid error response structure', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 500,
        error: { message: 'Internal server error' },
      };

      expect(response.success).toBe(false);
      expect(response.status).toBe(500);
      expect(response.error).toEqual({ message: 'Internal server error' });
    });

    it('should have success property as literal false', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 400,
        error: {},
      };

      expect(response.success).toBe(false);
      // Type system ensures this is literally false, not just boolean
      const successValue: false = response.success;
      expect(successValue).toBe(false);
    });

    it('should accept various HTTP status codes', () => {
      const statuses = [400, 401, 403, 404, 409, 422, 429, 500, 502, 503];

      statuses.forEach((status) => {
        const response: ErrorResponseBody = {
          success: false,
          status,
          error: { message: `Error ${status}` },
        };

        expect(response.status).toBe(status);
      });
    });

    it('should accept empty error object', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 500,
        error: {},
      };

      expect(Object.keys(response.error).length).toBe(0);
    });

    it('should accept error with message property', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 400,
        error: { message: 'Bad request' },
      };

      expect(response.error.message).toBe('Bad request');
    });

    it('should accept error with code property', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 404,
        error: {
          code: 'RESOURCE_NOT_FOUND',
          message: 'Resource not found',
        },
      };

      expect(response.error.code).toBe('RESOURCE_NOT_FOUND');
    });

    it('should accept error with stack trace', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 500,
        error: {
          message: 'Error occurred',
          stack: 'Error: at line 42...',
        },
      };

      expect(response.error.stack).toContain('Error:');
    });

    it('should accept error with nested objects', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 422,
        error: {
          message: 'Validation failed',
          details: {
            fields: [
              { name: 'email', error: 'Invalid' },
              { name: 'password', error: 'Too short' },
            ],
          },
        },
      };

      expect(response.error.details).toBeDefined();
    });

    it('should accept error with array values', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 400,
        error: {
          message: 'Multiple errors',
          errors: ['Error 1', 'Error 2', 'Error 3'],
        },
      };

      expect(Array.isArray(response.error.errors)).toBe(true);
    });

    it('should accept error with timestamp', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 500,
        error: {
          message: 'Error',
          timestamp: new Date().toISOString(),
        },
      };

      expect(response.error.timestamp).toBeDefined();
    });

    it('should accept error with path information', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 404,
        error: {
          message: 'Not found',
          path: '/api/users/123',
          method: 'GET',
        },
      };

      expect(response.error.path).toBe('/api/users/123');
    });

    it('should accept error with null values', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 500,
        error: {
          message: 'Error',
          data: null,
          user: null,
        },
      };

      expect(response.error.data).toBeNull();
    });

    it('should accept error with boolean values', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 500,
        error: {
          message: 'Error',
          isRetryable: true,
          isPermanent: false,
        },
      };

      expect(response.error.isRetryable).toBe(true);
    });

    it('should accept error with numeric values', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 429,
        error: {
          message: 'Rate limit exceeded',
          retryAfter: 60,
          limit: 100,
        },
      };

      expect(response.error.retryAfter).toBe(60);
    });

    it('should accept complex error structures', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 500,
        error: {
          type: 'DatabaseError',
          message: 'Connection failed',
          code: 'ECONNREFUSED',
          errno: -4078,
          syscall: 'connect',
          address: '127.0.0.1',
          port: 5432,
        },
      };

      expect(response.error.type).toBe('DatabaseError');
      expect(response.error.port).toBe(5432);
    });

    it('should accept error with undefined values', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 500,
        error: {
          message: 'Error',
          optional: undefined,
        },
      };

      expect(response.error.optional).toBeUndefined();
    });
  });

  describe('Type discrimination', () => {
    it('should discriminate between success and error by success property', () => {
      const responses: Array<SuccessResponseBody | ErrorResponseBody> = [
        { success: true, message: 'OK' },
        { success: false, status: 500, error: {} },
      ];

      responses.forEach((response) => {
        if (response.success) {
          // TypeScript knows this is SuccessResponseBody
          expect(response).toHaveProperty('message');
          expect(response.success).toBe(true);
        } else {
          // TypeScript knows this is ErrorResponseBody
          expect(response).toHaveProperty('status');
          expect(response).toHaveProperty('error');
          expect(response.success).toBe(false);
        }
      });
    });

    it('should handle union types correctly', () => {
      const handleResponse = (
        response: SuccessResponseBody | ErrorResponseBody
      ): string => {
        if (response.success) {
          return response.message;
        } else {
          return `Error ${response.status}`;
        }
      };

      expect(handleResponse({ success: true, message: 'OK' })).toBe('OK');
      expect(
        handleResponse({ success: false, status: 404, error: {} })
      ).toBe('Error 404');
    });
  });

  describe('Type immutability and structure', () => {
    it('should ensure SuccessResponseBody has required properties', () => {
      const response: SuccessResponseBody = {
        success: true,
        message: 'Test',
      };

      expect('success' in response).toBe(true);
      expect('message' in response).toBe(true);
    });

    it('should ensure ErrorResponseBody has required properties', () => {
      const response: ErrorResponseBody = {
        success: false,
        status: 500,
        error: {},
      };

      expect('success' in response).toBe(true);
      expect('status' in response).toBe(true);
      expect('error' in response).toBe(true);
    });

    it('should handle responses in arrays', () => {
      const responses: SuccessResponseBody[] = [
        { success: true, message: 'First' },
        { success: true, message: 'Second' },
        { success: true, message: 'Third' },
      ];

      expect(responses).toHaveLength(3);
      responses.forEach((r) => expect(r.success).toBe(true));
    });

    it('should handle error responses in arrays', () => {
      const errors: ErrorResponseBody[] = [
        { success: false, status: 400, error: {} },
        { success: false, status: 404, error: {} },
        { success: false, status: 500, error: {} },
      ];

      expect(errors).toHaveLength(3);
      errors.forEach((e) => expect(e.success).toBe(false));
    });
  });
});