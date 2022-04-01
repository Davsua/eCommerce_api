const { app } = require("./app");

const { sequelize } = require("./utils/database");
const { initModels } = require("./utils/initModels");

sequelize
  .authenticate()
  .then(() => console.log("server authenticated"))
  .catch((err) => console.log(err));

initModels();

sequelize
  .sync()
  .then(() => console.log("datababase sync"))
  .catch((err) => console.log(err));

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`connecting to express ... server port ${port}`);
});
