import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { middyfy } from "@lib/middleware";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export default middyfy(async () => {
    const command = new ScanCommand({
        TableName: process.env.TABLE_NAME!
    });

    const response = await docClient.send(command);

    console.log({response})

    return {
        statusCode: 200,
        body: JSON.stringify(response.Items)
    }
});