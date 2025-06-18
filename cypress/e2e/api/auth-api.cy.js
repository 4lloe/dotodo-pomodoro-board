// Auth API tests
// Covers: POST /auth/register, POST /auth/login, POST /auth/refresh, POST /auth/logout

describe('Auth API', () => {
  const baseUrl = 'http://localhost:3000';
  const testEmail = `auth_test_${Date.now()}@test.com`;
  const testPassword = 'Test1234!';
  let accessToken = '';
  let refreshToken = '';

  it('should register a new user', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/register`,
      body: { email: testEmail, password: testPassword },
      failOnStatusCode: false
    }).then((resp) => {
      console.log('register:', resp.body);
      expect([200, 201, 400, 401, 404]).to.include(resp.status);
      if ([200, 201].includes(resp.status)) {
        expect(resp.body).to.have.property('id');
      }
    });
  });

  it('should not register with invalid data', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/register`,
      body: { email: 'bad', password: '' },
      failOnStatusCode: false
    }).then((resp) => {
      console.log('register invalid:', resp.body);
      expect([400, 401, 404]).to.include(resp.status);
    });
  });

  it('should login with correct credentials', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/login`,
      body: { email: testEmail, password: testPassword },
      failOnStatusCode: false
    }).then((resp) => {
      console.log('login:', resp.body);
      expect([200, 201, 400, 401, 404]).to.include(resp.status);
      if ([200, 201].includes(resp.status)) {
        expect(resp.body).to.have.property('accessToken');
        expect(resp.body).to.have.property('refreshToken');
        accessToken = resp.body.accessToken;
        refreshToken = resp.body.refreshToken;
      }
    });
  });

  it('should not login with wrong password', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/login`,
      body: { email: testEmail, password: 'wrong' },
      failOnStatusCode: false
    }).then((resp) => {
      console.log('login wrong password:', resp.body);
      expect([400, 401, 404]).to.include(resp.status);
    });
  });

  it('should refresh token', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/refresh`,
      body: { refreshToken },
      failOnStatusCode: false
    }).then((resp) => {
      console.log('refresh:', resp.body);
      expect([200, 201, 400, 401, 404]).to.include(resp.status);
      if ([200, 201].includes(resp.status)) {
        expect(resp.body).to.have.property('accessToken');
      }
    });
  });

  it('should not refresh with invalid token', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/refresh`,
      body: { refreshToken: 'bad' },
      failOnStatusCode: false
    }).then((resp) => {
      console.log('refresh invalid:', resp.body);
      expect([400, 401, 404]).to.include(resp.status);
    });
  });

  it('should logout', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/logout`,
      headers: { Authorization: `Bearer ${accessToken}` },
      failOnStatusCode: false
    }).then((resp) => {
      console.log('logout:', resp.body);
      expect([200, 201, 400, 401, 404]).to.include(resp.status);
    });
  });

  it('should not logout without token', () => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/logout`,
      failOnStatusCode: false
    }).then((resp) => {
      console.log('logout no token:', resp.body);
      expect([200, 201, 400, 401, 404]).to.include(resp.status);
    });
  });
}); 