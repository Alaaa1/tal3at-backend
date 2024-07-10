import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { middyfy } from '@lib/middleware';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { PostFactory } from '@lib/factory/PostFactory';

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export default middyfy(async (event) => {
  const { author, description } = JSON.parse(event.body);

  const post = PostFactory.create(author, description);

  const command = new PutCommand({
    TableName: process.env.TABLE_NAME!,
    Item: { ...post }
  });

  await docClient.send(command);

  return {
    statusCode: 200,
    body: 'Post Created Successfully!'
  };
});
