import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { middyfy } from "@lib/middleware";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PublishCommand, SNSClient } from "@aws-sdk/client-sns"

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const snsClient = new SNSClient({});

export default middyfy(async (event) => {
    const { name, email } = event.body;
    const command = new PutCommand({
        TableName: process.env.TABLE_NAME!,
        Item: {
            pk: name,
            sk: email,
        },
    });

    const response = await docClient.send(command);

    await snsClient.send(new PublishCommand({
        Message: "User Created!",
        TopicArn: process.env.SNS_ARN!
    }))

    return {
        statusCode: 200,
        body: "User Created Successfully!"
    }
});