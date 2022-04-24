const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

const { testIds } = require('./test-db');

suite('Functional Tests', function() {


    test('test POST send every field', function (done) {

        const bodyObj = {
            issue_title: 'post every field test',
            issue_text: 'all testing and no play makes dave a dull boy',
            created_by: 'automated test',
            assigned_to: 'those we will never know',
            status_text: 'what is the status'
        };

        chai
            .request(server)
            .post('/api/issues/test-project')
            .send(bodyObj)
            .end(function (err, res) {
                assert.equal(res.status, 201);
                assert.containsAllKeys(res.body, bodyObj);
                assert.containsAllKeys(res.body, ['_id', 'created_on', 'updated_on', 'open']);
                assert.isTrue(res.body.open);
                assert.isNotNaN(Date.parse(res.body.created_on));
                assert.isNotNaN(Date.parse(res.body.updated_on));
                done();
            });
    });


    test('test POST only required fields', function (done) {

        const bodyObj = {
            issue_title: 'post only required fields test',
            issue_text: 'all testing and no play makes dave a dull boy',
            created_by: 'automated test'
        };

        chai
            .request(server)
            .post('/api/issues/test-project')
            .send(bodyObj)
            .end(function (err, res) {
                assert.equal(res.status, 201);
                assert.containsAllKeys(res.body, bodyObj);
                assert.containsAllKeys(res.body, ['_id', 'created_on', 'updated_on', 'open', 'assigned_to', 'status_text']);
                assert.isTrue(res.body.open);
                assert.isNotNaN(Date.parse(res.body.created_on));
                assert.isNotNaN(Date.parse(res.body.updated_on));
                done();
            });

    });


    test('test POST without required fields', function (done) {

        const bodyObj = {};

        chai
            .request(server)
            .post('/api/issues/test-project')
            .send(bodyObj)
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'required field(s) missing' });
                done();
            });

    });


    test('test GET view issues', function (done) {

        chai
            .request(server)
            .get('/api/issues/test-project')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.isAtLeast(res.body.length, 2);
                done();
            });
    });


    test('test GET view issues one filter', function (done) {
        
        chai
            .request(server)
            .get('/api/issues/test-project?issue_title=post%20every%20field%20test')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.isAtLeast(res.body.length, 1);
                done();
            });
    });


    test('test GET view issues multiple filters', function (done) {

        chai
            .request(server)
            .get('/api/issues/test-project?issue_title=post%20every%20field%20test&created_by=automated%20test')
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.isArray(res.body);
                assert.isAtLeast(res.body.length, 1);
                done();
            });
    });


    test('test PUT update single field', function (done) {

        chai
            .request(server)
            .put('/api/issues/test-project')
            .send({
                _id: testIds[0],
                open: false
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { result: 'successfully updated', _id: testIds[0] });
                done();
            });
    });


    test('test PUT update multiple fields', function (done) {

        chai
            .request(server)
            .put('/api/issues/test-project')
            .send({
                _id: testIds[1],
                open: false,
                assigned_to: 'someone else'
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { result: 'successfully updated', _id: testIds[1] });
                done();
            });
    });


    test('test PUT update without _id', function (done) {

        chai
            .request(server)
            .put('/api/issues/test-project')
            .send({
                open: false
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'missing _id' });
                done();
            });
    });


    test('test PUT update without fields', function (done) {

        chai
            .request(server)
            .put('/api/issues/test-project')
            .send({
                _id: testIds[1]
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'no update field(s) send', _id: testIds[1] });
                done();
            });
    });


    test('test PUT update with invalid _id', function (done) {

        chai
            .request(server)
            .put('/api/issues/test-project')
            .send({
                _id: '????????',
                open: false
            })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'could not update', _id: '????????' });
                done();
            });
    });


    test('test DELETE', function (done) {

        chai
            .request(server)
            .delete('/api/issues/test-project')
            .send({ _id: testIds[2] })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { result: 'successfully deleted', _id: testIds[2] });
                done();
            });
    });


    test('test DELETE with invalid _id', function (done) {
        
        chai
            .request(server)
            .delete('/api/issues/test-project')
            .send({ _id: '????????' })
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'could not delete', _id: '????????' });
                done();
            });
    });


    test('test DELETE with missing _id', function (done) {
        
        chai
            .request(server)
            .delete('/api/issues/test-project')
            .send({})
            .end(function (err, res) {
                assert.equal(res.status, 200);
                assert.deepEqual(res.body, { error: 'missing _id' });
                done();
            });
    });
  
});
