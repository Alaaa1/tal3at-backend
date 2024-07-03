import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { middyfy } from "@lib/middleware";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export default middyfy(async (event) => {
  const {postId} = event.pathParameters;

  if (!postId) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: {
            title: "ValidatationError",
            message: "postId is required"
        }
    })
    }
  }

    const command = new GetCommand({
        TableName: process.env.TABLE_NAME!,
        Key: {
          pk: 'post',
          sk: postId
        }
    });

    const response = await docClient.send(command);

    if (!response.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: {
              title: "Post Not Found",
              message: `Post with id ${postId} was not found`
          }
      })
      }
    }

    const likes = response.Item.likes + 1;

    const updateCommand = new UpdateCommand({
      TableName: process.env.TABLE_NAME!,
      Key: {
        pk: 'post',
        sk: postId
      },
      UpdateExpression: 'set likes = :likes',
      ExpressionAttributeValues: {
        ":likes": likes
      }
  });

  const updateResponse =  await docClient.send(updateCommand);

    console.log({updateResponse})

    return {
        statusCode: 200,
        body: JSON.stringify(response.Item)
    }
});