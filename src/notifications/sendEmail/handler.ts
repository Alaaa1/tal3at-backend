import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";


const sesClient = new SESClient({});

export default async (event, context) => {

    const command = new SendEmailCommand({
        Destination: {
            ToAddresses: [
                "alaa0602@hotmail.com"
            ],
        },
        Message: {
            Body: {
                Text: {
                    Charset: "UTF-8",
                    Data: "A new user has been created",
                },
            },
            Subject: {
                Charset: "UTF-8",
                Data: "New User Created",
            },
        },
        Source: "a.ali@calo.app"
    });

    event.Records.forEach(async record => {
        const { body } = record;
        console.log(record.messageId);
        console.log(body);
        try {
            await sesClient.send(command);
            console.log("Email sent!");
        } catch (e) {
            console.error(e);
        }
    });
    return {};
};