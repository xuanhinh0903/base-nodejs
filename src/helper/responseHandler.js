const returnError = ({ statusCode, message }) => {
  return {
    response: {
      status: false,
      code: statusCode,
      message,
      data: null,
    },
  };
};

const returnSuccess = ({ statusCode, message, data = {} }) => {
  return {
    response: {
      status: true,
      code: statusCode,
      message,
      data,
    },
  };
};

export default { returnError, returnSuccess };
