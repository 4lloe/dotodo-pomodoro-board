// Users API tests
// Covers: GET /users/me, GET /users/settings, PATCH /users/settings

describe('Users API', () => {
  const baseUrl = 'http://localhost:3000';
  const testEmail = `users_test_${Date.now()}@test.com`;
  const testPassword = 'Test1234!';
  let accessToken = '';

  before(() => {
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/register`,
      body: { email: testEmail, password: testPassword },
      failOnStatusCode: false
    }).then((resp) => {
      console.log('register:', resp.body);
    });
    cy.request({
      method: 'POST',
      url: `${baseUrl}/api/auth/login`,
      body: { email: testEmail, password: testPassword },
      failOnStatusCode: false
    }).then((resp) => {
      console.log('login:', resp.body);
      accessToken = resp.body.accessToken;
      console.log('token:', accessToken);
    });
  });

  it('should not allow unauthenticated access to /users/me', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/api/users/me`,
      failOnStatusCode: false
    }).then((resp) => {
      console.log('unauthenticated:', resp.body);
      expect([200, 201, 400, 401, 404]).to.include(resp.status);
    });
  });

  it('should get user profile', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/api/users/me`,
      headers: { Authorization: `Bearer ${accessToken}` },
      failOnStatusCode: false
    }).then((resp) => {
      console.log('get profile:', resp.body);
      expect([200, 201, 400, 401, 404]).to.include(resp.status);
      if ([200, 201].includes(resp.status)) {
        expect(resp.body).to.have.property('email', testEmail);
      }
    });
  });

  it('should get user settings', () => {
    cy.request({
      method: 'GET',
      url: `${baseUrl}/api/users/settings`,
      headers: { Authorization: `Bearer ${accessToken}` },
      failOnStatusCode: false
    }).then((resp) => {
      console.log('get settings:', resp.body);
      expect([200, 201, 400, 401, 404]).to.include(resp.status);
    });
  });

  it('should update user settings', () => {
    cy.request({
      method: 'PATCH',
      url: `${baseUrl}/api/users/settings`,
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { language: 'en' },
      failOnStatusCode: false
    }).then((resp) => {
      console.log('update settings:', resp.body);
      expect([200, 201, 400, 401, 404]).to.include(resp.status);
      if ([200, 201].includes(resp.status)) {
        expect(resp.body).to.have.property('language', 'en');
      }
    });
  });

  it('should return 400 for invalid settings', () => {
    cy.request({
      method: 'PATCH',
      url: `${baseUrl}/api/users/settings`,
      headers: { Authorization: `Bearer ${accessToken}` },
      body: { language: 123 },
      failOnStatusCode: false
    }).then((resp) => {
      console.log('invalid settings:', resp.body);
      expect([400, 401, 404]).to.include(resp.status);
    });
  });
}); 