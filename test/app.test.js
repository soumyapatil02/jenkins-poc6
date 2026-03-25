const chai = require('chai');
const expect = chai.expect;
const request = require('supertest');
const app = require('../app');
const { calculateAge, formatName, validateEmail } = require('../utils/helper');

// --- Helper function tests ---
describe('Helper Functions', function() {

    describe('calculateAge()', function() {
        it('should correctly calculate age from birth year', function() {
            const age = calculateAge(2000);
            expect(age).to.equal(new Date().getFullYear() - 2000);
        });
    });

    describe('formatName()', function() {
        it('should convert lowercase name to Title Case', function() {
            expect(formatName('alice smith')).to.equal('Alice Smith');
        });
        it('should handle single word names', function() {
            expect(formatName('alice')).to.equal('Alice');
        });
    });

    describe('validateEmail()', function() {
        it('should return true for valid email', function() {
            expect(validateEmail('test@example.com')).to.equal(true);
        });
        it('should return false for invalid email', function() {
            expect(validateEmail('not-an-email')).to.equal(false);
        });
    });

});

// --- API endpoint tests ---
describe('API Endpoints', function() {

    describe('GET /health', function() {
        it('should return status UP', function(done) {
            request(app)
                .get('/health')
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.status).to.equal('UP');
                    done();
                });
        });
    });

    describe('GET /api/users', function() {
        it('should return list of users', function(done) {
            request(app)
                .get('/api/users')
                .expect(200)
                .end(function(err, res) {
                    expect(res.body).to.be.an('array');
                    expect(res.body.length).to.be.greaterThan(0);
                    done();
                });
        });
    });

    describe('GET /api/users/:id', function() {
        it('should return a single user', function(done) {
            request(app)
                .get('/api/users/1')
                .expect(200)
                .end(function(err, res) {
                    expect(res.body).to.have.property('name');
                    expect(res.body).to.have.property('age');
                    done();
                });
        });
        it('should return 404 for non existing user', function(done) {
            request(app)
                .get('/api/users/999')
                .expect(404)
                .end(function(err, res) {
                    expect(res.body.error).to.equal('User not found');
                    done();
                });
        });
    });

    describe('POST /api/users', function() {
        it('should create a new user', function(done) {
            request(app)
                .post('/api/users')
                .send({ name: 'david brown', birthYear: 1990 })
                .expect(201)
                .end(function(err, res) {
                    expect(res.body.name).to.equal('David Brown');
                    done();
                });
        });
        it('should return 400 if name is missing', function(done) {
            request(app)
                .post('/api/users')
                .send({ birthYear: 1990 })
                .expect(400)
                .end(function(err, res) {
                    expect(res.body.error).to.equal('Name and birthYear are required');
                    done();
                });
        });
    });

    describe('DELETE /api/users/:id', function() {
        it('should delete a user', function(done) {
            request(app)
                .delete('/api/users/1')
                .expect(200)
                .end(function(err, res) {
                    expect(res.body.message).to.equal('User deleted successfully');
                    done();
                });
        });
    });

});