'use strict';

const AWS = require('aws-sdk');

const uuid = require('uuid');

const dynamoDb = new AWS.DynamoDB.DocumentClient({
  api_version: '2012-08-10',
  region: 'us-east-1'
});

module.exports.handler = async (event, context, callback) => {

  console.log(event)

  if(event.text && typeof event.text !== 'string') {
    console.error('Validation failed!');
    callback(new Error('Body did not contain a text property'));
    return;
  }

  const params = {
    TableName: 'BlogTable',
    Item: {
      article_id: uuid.v1(),
      text: event.text
    }
  };

  const putCallback = (error, result) => {

    console.log('error', error);
    console,log('result', result);
    
    if(error) {
      console.error('Erro ao inserir no banco!!!');
      callback(new Error('Cannot save record!'));
      return;
    }

    const response = {
      statusCode: 200,
      body: JSON.stringify(result.Item)
    };

    callback(null, response);
  }

  dynamoDb.put(params, putCallback);

};
