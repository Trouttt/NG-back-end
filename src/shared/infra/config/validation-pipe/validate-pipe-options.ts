export default {
  validationError: { target: true, value: true },
  forbidUnknownValues: true,
  transform: true,
  transformOptions: {
    enableImplicitConversion: true,
  },
  errorHttpStatusCode: 422,
};
