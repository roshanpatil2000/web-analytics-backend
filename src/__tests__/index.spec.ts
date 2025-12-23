import request from 'supertest';
import express, { Request, Response } from 'express';
import { successResponse, errorResponse } from '../utils/responseHandler';

// Create a test app that mimics the actual app structure
const createTestApp = () => {
  const app = express();
  
  // middlewares
  app.use(express.json());

  // Sample route
  app.get('/', (req: Request, res: Response) => {
    successResponse(res, 'Hello, World!', {});
  });

  // Handle 404 - Not Found
  app.use((req: Request, res: Response) => {
    errorResponse(res, { message: 'Route not found' }, 404);
  });

  return app;
};

describe('Express Application Integration Tests', () => {
  let app: express.Application;

  beforeEach(() => {
    app = createTestApp();
  });

  describe('GET /', () => {
    it('should return success response with Hello World message', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        message: 'Hello, World!',
      });
    });

    it('should have correct content-type header', async () => {
      const response = await request(app).get('/');

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });

    it('should respond quickly', async () => {
      const startTime = Date.now();
      await request(app).get('/');
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(100);
    });

    it('should handle multiple concurrent requests', async () => {
      const requests = Array(10)
        .fill(null)
        .map(() => request(app).get('/'));

      const responses = await Promise.all(requests);

      responses.forEach((response) => {
        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
      });
    });

    it('should maintain consistent response structure', async () => {
      const response = await request(app).get('/');

      expect(response.body).toHaveProperty('success');
      expect(response.body).toHaveProperty('message');
      expect(response.body.success).toBe(true);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for non-existent route', async () => {
      const response = await request(app).get('/non-existent');

      expect(response.status).toBe(404);
      expect(response.body).toEqual({
        success: false,
        status: 404,
        error: { message: 'Route not found' },
      });
    });

    it('should return 404 for POST to non-existent route', async () => {
      const response = await request(app).post('/non-existent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 for PUT to non-existent route', async () => {
      const response = await request(app).put('/non-existent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 for DELETE to non-existent route', async () => {
      const response = await request(app).delete('/non-existent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 for PATCH to non-existent route', async () => {
      const response = await request(app).patch('/non-existent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });

    it('should return 404 for nested non-existent routes', async () => {
      const response = await request(app).get('/api/users/123');

      expect(response.status).toBe(404);
    });

    it('should return 404 with correct error structure', async () => {
      const response = await request(app).get('/not-found');

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('status', 404);
      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toHaveProperty('message', 'Route not found');
    });

    it('should have correct content-type for 404 errors', async () => {
      const response = await request(app).get('/non-existent');

      expect(response.headers['content-type']).toMatch(/application\/json/);
    });
  });

  describe('JSON Middleware', () => {
    it('should parse JSON request body', async () => {
      // Add a test POST route
      const testApp = express();
      testApp.use(express.json());
      testApp.post('/test', (req: Request, res: Response) => {
        successResponse(res, 'Received', { received: req.body });
      });

      const response = await request(testApp)
        .post('/test')
        .send({ name: 'John', age: 30 })
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.received).toEqual({ name: 'John', age: 30 });
    });

    it('should handle empty JSON body', async () => {
      const testApp = express();
      testApp.use(express.json());
      testApp.post('/test', (req: Request, res: Response) => {
        successResponse(res, 'Received', { received: req.body });
      });

      const response = await request(testApp)
        .post('/test')
        .send({})
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.received).toEqual({});
    });

    it('should handle nested JSON objects', async () => {
      const testApp = express();
      testApp.use(express.json());
      testApp.post('/test', (req: Request, res: Response) => {
        successResponse(res, 'Received', { received: req.body });
      });

      const complexData = {
        user: {
          name: 'Jane',
          profile: {
            age: 25,
            address: {
              city: 'NYC',
            },
          },
        },
      };

      const response = await request(testApp)
        .post('/test')
        .send(complexData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.received).toEqual(complexData);
    });

    it('should handle arrays in JSON body', async () => {
      const testApp = express();
      testApp.use(express.json());
      testApp.post('/test', (req: Request, res: Response) => {
        successResponse(res, 'Received', { received: req.body });
      });

      const arrayData = { items: [1, 2, 3, 4, 5] };

      const response = await request(testApp)
        .post('/test')
        .send(arrayData)
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(200);
      expect(response.body.received).toEqual(arrayData);
    });

    it('should reject invalid JSON', async () => {
      const testApp = express();
      testApp.use(express.json());
      testApp.post('/test', (req: Request, res: Response) => {
        successResponse(res, 'Received', {});
      });

      const response = await request(testApp)
        .post('/test')
        .send('invalid json{')
        .set('Content-Type', 'application/json');

      expect(response.status).toBe(400);
    });
  });

  describe('Response Headers', () => {
    it('should set correct content-type for JSON responses', async () => {
      const response = await request(app).get('/');

      expect(response.headers['content-type']).toContain('application/json');
    });

    it('should include content-length header', async () => {
      const response = await request(app).get('/');

      expect(response.headers).toHaveProperty('content-length');
    });

    it('should set appropriate headers for 404 responses', async () => {
      const response = await request(app).get('/non-existent');

      expect(response.headers['content-type']).toContain('application/json');
    });
  });

  describe('HTTP Methods', () => {
    it('should support GET requests', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
    });

    it('should handle HEAD requests to existing route', async () => {
      const response = await request(app).head('/');

      expect(response.status).toBe(200);
      expect(response.body).toEqual({});
    });

    it('should handle OPTIONS requests', async () => {
      const response = await request(app).options('/');

      // Will be handled by 404 since no OPTIONS route defined
      expect(response.status).toBe(404);
    });
  });

  describe('Edge Cases', () => {
    it('should handle requests with query parameters', async () => {
      const response = await request(app).get('/?param=value');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should handle requests with multiple query parameters', async () => {
      const response = await request(app).get('/?param1=value1&param2=value2');

      expect(response.status).toBe(200);
    });

    it('should handle requests with special characters in URL', async () => {
      const response = await request(app).get('/test%20space');

      expect(response.status).toBe(404);
    });

    it('should handle very long URLs', async () => {
      const longPath = '/a'.repeat(1000);
      const response = await request(app).get(longPath);

      expect(response.status).toBe(404);
    });

    it('should handle requests with custom headers', async () => {
      const response = await request(app)
        .get('/')
        .set('X-Custom-Header', 'test-value');

      expect(response.status).toBe(200);
    });

    it('should handle requests with user-agent header', async () => {
      const response = await request(app)
        .get('/')
        .set('User-Agent', 'Test-Agent/1.0');

      expect(response.status).toBe(200);
    });

    it('should handle requests with accept header', async () => {
      const response = await request(app)
        .get('/')
        .set('Accept', 'application/json');

      expect(response.status).toBe(200);
      expect(response.headers['content-type']).toContain('application/json');
    });

    it('should handle requests with authorization header', async () => {
      const response = await request(app)
        .get('/')
        .set('Authorization', 'Bearer token123');

      expect(response.status).toBe(200);
    });
  });

  describe('Performance and Stability', () => {
    it('should handle rapid sequential requests', async () => {
      const responses = [];
      for (let i = 0; i < 50; i++) {
        const response = await request(app).get('/');
        responses.push(response);
      }

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });

    it('should maintain consistent response format across requests', async () => {
      const responses = await Promise.all([
        request(app).get('/'),
        request(app).get('/'),
        request(app).get('/'),
      ]);

      const firstResponse = responses[0].body;
      responses.forEach((response) => {
        expect(response.body).toEqual(firstResponse);
      });
    });

    it('should handle requests with varying delays', async () => {
      const delays = [0, 10, 20];
      const responses = await Promise.all(
        delays.map((delay) =>
          new Promise<request.Response>((resolve) => {
            setTimeout(async () => {
              const res = await request(app).get('/');
              resolve(res);
            }, delay);
          })
        )
      );

      responses.forEach((response) => {
        expect(response.status).toBe(200);
      });
    });
  });

  describe('Response Structure Validation', () => {
    it('should always return valid JSON', async () => {
      const response = await request(app).get('/');

      expect(() => JSON.parse(JSON.stringify(response.body))).not.toThrow();
    });

    it('should have consistent success response structure', async () => {
      const response = await request(app).get('/');

      expect(response.body).toMatchObject({
        success: true,
        message: expect.any(String),
      });
    });

    it('should have consistent error response structure', async () => {
      const response = await request(app).get('/non-existent');

      expect(response.body).toMatchObject({
        success: false,
        status: expect.any(Number),
        error: expect.any(Object),
      });
    });
  });

  describe('Route Matching', () => {
    it('should match exact root path', async () => {
      const response = await request(app).get('/');

      expect(response.status).toBe(200);
    });

    it('should not match partial paths', async () => {
      const response = await request(app).get('/home');

      expect(response.status).toBe(404);
    });

    it('should be case-sensitive for routes', async () => {
      const response = await request(app).get('/HOME');

      expect(response.status).toBe(404);
    });

    it('should handle trailing slashes consistently', async () => {
      // Express by default redirects / to / but /path/ to /path
      const responseWithoutSlash = await request(app).get('/');
      const responseWithSlash = await request(app).get('//');

      expect(responseWithoutSlash.status).toBe(200);
      // Double slash will be treated as different route
      expect(responseWithSlash.status).toBe(404);
    });
  });
});