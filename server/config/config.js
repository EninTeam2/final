module.exports = {
  db: {
    DATABASE: "real",
    USER: "root",
    PASSWORD: "12345",
    HOST: "localhost",
    dialect: "mysql",
  },
  session: {
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    secure: false,
    maxage: 1000 * 60 * 60 * 24,
  },
  cors: {
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET", "PUT", "DELETE"],
    credentials: true,
  },
};
