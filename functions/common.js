const sendData = (status, data) => {
  let statusCode = {
    200: "Success",
    201: "Created",
    400: "Bad request",
    401: "Unauthorized",
    404: "Not found",
    500: "InternalServer Error",
  };

  let new_res = {
    status: status,
    message: statusCode[status],
    ...(data ? { data: data } : {}),
  };
  return new_res;
};

module.exports = { sendData };
