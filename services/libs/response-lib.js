export function success(body) {
  return buildResponse(200, body);
}

export function failure(e) {
  return buildResponse(500,
    {
      error: {
        message: e.message,
        rawError: e
      }
    }
  );
}

function buildResponse(statusCode, body) {
  return {
    statusCode: statusCode,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
    body: JSON.stringify(body)
  };
}
