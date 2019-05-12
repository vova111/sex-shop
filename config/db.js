module.exports = {
  db: {
    uri: 'mongodb://localhost:27017/shop',
    connect: {
      config: {
        autoIndex: false,
      },
      useNewUrlParser: true,
    },
  },
};
