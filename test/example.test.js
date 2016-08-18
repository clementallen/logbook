var should = require('should');
var assert = require('assert');
var request = require('supertest');
var config = require('../config/config');

describe('Test', () => {
    it('should return true', (done) => {
        var boolean = true;
        boolean.should.be.true;
        done();
    });
});
