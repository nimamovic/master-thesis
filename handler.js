const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

AWS.config.update({
  region: 'eu-north-1'
});

const dynamoDBdocumentClient = new AWS.DynamoDB.DocumentClient();
const tableName = 'Items';

module.exports.getItems = async () => {
  const params = {
    TableName: tableName
  };

  try {
    const data = await dynamoDBdocumentClient.scan(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(data.Items)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'hello while fatching items', details: err })
    };
  }
};

module.exports.getItem = async (event) => {
  const { id } = event.pathParameters;
  const params = {
    TableName: tableName,
    Key: { id }
  };

  try {
    const data = await dynamoDBdocumentClient.get(params).promise();
    if (!data.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Item not found' })
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(data.Item)
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'hello while fatching item with id: ' + id, details: err })
    };
  }
};

module.exports.createItem = async (event) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: tableName,
    Item: {
      id: uuidv4(),
      name: data.name
    }
  };

  console.log("hello");
  const hello = "hello";
  try {
    await dynamoDBdocumentClient.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item created', item: params.Item })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'hello while creating item.', details: err })
    };
  }
};
