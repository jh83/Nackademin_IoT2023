import { DynamoDBClient } from "@aws-sdk/client-dynamodb";

import {
  DynamoDBDocumentClient,
  ScanCommand,
  //QueryCommand,
  //PutCommand,
  //GetCommand,
  //DeleteCommand,
} from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const dynamo = DynamoDBDocumentClient.from(client);

const tableName = process.env.tableName;
const allowedHeader = process.env.allowedHeader;

export const handler = async (event) => {

  console.log("Incoming Event:", event)

  let body = {};
  let statusCode = 401;

  // Check "authorization" header
  if (event.headers?.authorization == allowedHeader) {

    // If GET request
    if (event.requestContext.http.method == "GET") {

      // Check path
      switch (event.requestContext.http.path) {

        // If "/items". Return all
        case "/items":

          // if reqest has startTime/endTime
          if (event.queryStringParameters?.startTs && event.queryStringParameters?.endTs) {

            const { startTs, endTs } = event.queryStringParameters;
            console.log("tsSpan:", startTs, endTs)

            const params = {
              TableName: tableName,

              FilterExpression: '#timestamp BETWEEN :startTs AND :endTs',
              ExpressionAttributeNames: {
                '#timestamp': 'timestamp'
              },
              ExpressionAttributeValues: {
                ':startTs': startTs,
                ':endTs': endTs
              }
            };

            body = await dynamo.send(new ScanCommand(params));
            console.log("body:", body)
          }
          else {
            body = await dynamo.send(
              new ScanCommand({ TableName: tableName })
            );
          }

          statusCode = 200;
          body = body.Items;
          break;

        default:
          break;
      }
    }
  }

  return {
    statusCode,
    body: JSON.stringify(body)
  }
};