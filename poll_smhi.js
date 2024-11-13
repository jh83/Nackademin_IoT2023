import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
}
  from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client);

const tableName = "telemetry";

export const handler = async (event) => {

  const r = await fetch("https://opendata-download-metobs.smhi.se/api/version/latest/parameter/1/station/72420/period/latest-hour/data.json");
  const rJson = await r.json();

  if (r.status === 200) {
    console.log(JSON.stringify(rJson))
    await dynamo.send(
      new PutCommand({
        TableName: tableName,
        Item: {
          "device_id": rJson.station.key,
          "timestamp": rJson.value[0].date,
          "name": rJson.station.name,
          "device_type": "weatherStation",
          "temperature": parseFloat(rJson.value[0].value)
        },
      })
    );

  }

  /*
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  */
  //return response;
  return {};
};