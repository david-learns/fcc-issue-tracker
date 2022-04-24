'use strict';

const { ObjectId } = require('mongodb');

const { inspect } = require('util');
const utilInspectOptions =  {
  depth: 5,
  colors: true,
  compact: false
};


module.exports = function (app) {

  app.route('/api/issues/:project')


  
    .get(function (req, res){
      let project = req.params.project;

      app.locals.db.collection(project).find(req.query).toArray().then(issues => {
        res.send(issues);
      });
      
    })


    
    .post(function (req, res){
      let project = req.params.project;

      const hasRequiredFields = req.body.issue_title && req.body.issue_text && req.body.created_by
      if (!hasRequiredFields) {
        res.send({ error: 'required field(s) missing' })
        return
      }

      const issueObj = {
        _id: new ObjectId(),
        assigned_to: req.body.assigned_to ? req.body.assigned_to : '',
        status_text: req.body.status_text ? req.body.status_text : '',
        open: true,
        issue_title: req.body.issue_title,
        issue_text: req.body.issue_text,
        created_by: req.body.created_by,
        created_on: new Date().toJSON(),
        updated_on: new Date().toJSON()
      };

      app.locals.db.collection(project).insertOne(issueObj).then(() => {
        res.status(201);
        res.send(issueObj);
      });
      
    })


    
    .put(function (req, res){
      let project = req.params.project;

      console.log(`PUT /api/issues/${project}, body: ${inspect(req.body)}`)

      if (!req.body._id) {
        res.send({ error: 'missing _id' })
        return
      }

      if (!ObjectId.isValid(req.body._id)) {
        res.send({ error: 'could not update', _id: req.body._id })
        return
      }

      const updates = {}
      const validUpdates = ['issue_title', 'issue_text', 'created_by', 'assigned_to', 'status_text', 'open']
      const hasUpdateFields = validUpdates.some(e => req.body.hasOwnProperty(e))
      
      if (!hasUpdateFields) {
        res.send({ error: 'no update field(s) sent', _id: req.body._id})
        return
      }

      validUpdates.forEach(e => {
        if (req.body.hasOwnProperty(e)) {
          updates[e] = e === 'open' ? JSON.parse(req.body[e]) : req.body[e]
        }
      })
      updates.updated_on = new Date().toJSON()

      app.locals.db.collection(project).updateOne({ _id: new ObjectId(req.body._id) }, { $set: updates }).then((result) => {
        if (result.modifiedCount === 1) {
          res.send({ result: 'successfully updated', _id: req.body._id })
        } else {
          res.send({ error: 'could not update', _id: req.body._id })
        }
      })
      
    })
    


    .delete(function (req, res){
      let project = req.params.project;

      console.log(`DELETE /api/issues/${project}, body: ${inspect(req.body)}`)

      if (!req.body._id) {
        res.send({ error: 'missing _id' })
        return
      }

      if (!ObjectId.isValid(req.body._id)) {
        res.send({ error: 'could not delete', _id: req.body._id })
        return
      }

      app.locals.db.collection(project).deleteOne({ _id: new ObjectId(req.body._id) }).then((result) => {
        console.log(result)
        if (result.deletedCount === 1) {
          res.send({ result: 'successfully deleted', _id: req.body._id })
        } else {
          res.send({ error: 'could not delete', _id: req.body._id })
        }
      })
      
    });


    
};

