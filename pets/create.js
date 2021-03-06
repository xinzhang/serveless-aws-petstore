const uuid = require('uuid');

const AWS = require('aws-sdk');

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.create = (event, context, callback) => {
    const timestamp = new Date().getTime();
    const data = JSON.parse(event.body);

    if (typeof data.petName !== 'string' || typeof data.petBreed !== 'string' ) {
        console.error('Validation Failed');
        callback(new Error('could not create the pet item'));
        return;
    }

    const params = {
        TableName : process.env.DYNAMODB_TABLE,
        Item : {
            id: uuid.v1(),
            petName: data.petName,
            petBreed : data.petBreed,
            createdAt : timestamp,
            updatedAt : timestamp,
        }
    }

    dynamoDb.put(params, (error) => {
        if (error) {
            console.error(error);
            callback(new Error('could not create the pet item'));
            return;
        }

        const response = {
            statusCode : 200, 
            body: JSON.stringify(params.Item)
        };

        callback(null, response);
    })

}