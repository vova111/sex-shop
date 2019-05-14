module.exports = {
  db: {
    uri: 'mongodb://localhost:27017/shop',
    connect: {
      config: {
        autoIndex: true,
      },
      useNewUrlParser: true,
    },
  },
};
