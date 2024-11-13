export const handler = async (event) => {
  console.log("event: ", event);

  const token = process.env.TelegramToken;
  const chatId = process.env.TelegramChatID;

  const r = await fetch(`https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${event.clientId} was ${event.eventType}!`);

  if (r.status === 200) {
    context.log("R: ", r)
    return { statusCode: 200, body: JSON.stringify("Success") };
  }

  let response = {
    statusCode: 400,
    body: JSON.stringify('Error'),
  };
  return response;
};