export const handler = async (event: any = {}): Promise<any> => {

  const requestedItemId = event.pathParameters.id;

  return { statusCode: 200, body: `Thank you for PUTting ${requestedItemId}` };

};