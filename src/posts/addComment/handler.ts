import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { middyfy } from "@lib/middleware";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export default middyfy(async (event) => {
  const { postId } = event.pathParameters;
  const { commentText } = JSON.parse(event.body);

  console.log({ commentText });

  if (!postId) {
    return {
      statusCode: 422,
      body: JSON.stringify({
        error: {
          title: "ValidatationError",
          message: "postId is required",
        },
      }),
    };
  }

  const command = new GetCommand({
    TableName: process.env.TABLE_NAME!,
    Key: {
      pk: "post",
      sk: postId,
    },
  });

  const response = await docClient.send(command);

  if (!response.Item) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: {
          title: "Post Not Found",
          message: `Post with id ${postId} was not found`,
        },
      }),
    };
  }

  const comments: string[] = response.Item.comments;
  comments.push(commentText);

  const updateCommand = new UpdateCommand({
    TableName: process.env.TABLE_NAME!,
    Key: {
      pk: "post",
      sk: postId,
    },
    UpdateExpression: "set comments = :comments",
    ExpressionAttributeValues: {
      ":comments": comments,
    },
  });

  await docClient.send(updateCommand);

  return {
    statusCode: 200,
    body: JSON.stringify(response.Item),
  };
});
