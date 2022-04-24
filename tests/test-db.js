'use strict';

const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const issue0 = {
    _id: new ObjectId(),
    issue_title: 'issue title 0',
    issue_text: 'Self power explains subtle force fields. Awareness co creates existential neural networks.',
    created_by: 'test db setup',
    open: true,
    assigned_to: 'issue0',
    status_text: 'status of issue0',
    created_on: new Date().toJSON(),
    updated_on: new Date().toJSON()
}

const issue1 = {
    _id: new ObjectId(),
    issue_title: 'issue title 1',
    issue_text: 'A formless void unfolds through nonlocal destiny. Love is mirrored in unparalleled molecules.',
    created_by: 'test db setup',
    open: true,
    assigned_to: 'issue1',
    status_text: 'status of issue1',
    created_on: new Date().toJSON(),
    updated_on: new Date().toJSON()
}

const issue2 = {
    _id: new ObjectId(),
    issue_title: 'issue title 2',
    issue_text: 'Infinity alleviates the flow of excellence. Transcendence is an ingredient of deep fulfillment.',
    created_by: 'test db setup',
    open: true,
    assigned_to: 'issue2',
    status_text: 'status of issue2',
    created_on: new Date().toJSON(),
    updated_on: new Date().toJSON()
}

const issue3 = {
    _id: new ObjectId(),
    issue_title: 'issue title 3',
    issue_text: '"The soul is the womb of self-righteous possibilities. Your heart nurtures the doorway to positivity.',
    created_by: 'test db setup',
    open: true,
    assigned_to: 'issue3',
    status_text: 'status of issue3',
    created_on: new Date().toJSON(),
    updated_on: new Date().toJSON()
}

const issue4 = {
    _id: new ObjectId(),
    issue_title: 'issue title 4',
    issue_text: 'Making tea is inside boundless brightness. The mind belongs to immortal knowledge.',
    created_by: 'test db setup',
    open: true,
    assigned_to: 'issue4',
    status_text: 'status of issue4',
    created_on: new Date().toJSON(),
    updated_on: new Date().toJSON()
}

const issue5 = {
    _id: new ObjectId(),
    issue_title: 'issue title 5',
    issue_text: 'The future results from incredible photons. Hidden meaning serves spiritual energy.',
    created_by: 'test db setup',
    open: true,
    assigned_to: 'issue5',
    status_text: 'status of issue5',
    created_on: new Date().toJSON(),
    updated_on: new Date().toJSON()
}

const issues = [issue0, issue1, issue2, issue3, issue4, issue5];

let testIds = issues.map(e => e._id.toString());

function setupTestDb() {

    const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PW}@${process.env.DB_HOST}?retryWrites=true&w=majority`;
    MongoClient.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true },
    function (err, client) {
        if (err) throw err;
        const db = client.db(process.env.DB_NAME);

        // drop test collection if it exists
        db.listCollections({ name: 'test-project' }).toArray((err, arr) => {
            if (arr.length > 0) {
                db.collection('test-project').drop(() => {
                    console.log('test-project collection dropped');
                });
            }
        });

        // add test docs and set ObjectId's to testIds
        db.collection('test-project').insertMany(issues).then(result => {
            console.log('added test issues');
        });
    });

}

module.exports = {
    setupTestDb,
    testIds
};