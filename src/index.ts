import dotenv from "dotenv";
import { app } from "./app";
import { dbConnection } from "./db";

dotenv.config();

dbConnection()
  .then(() => {
    app.listen(process.env.PORT || 8080);
    console.log(`server is running on port ${process.env.PORT}`);
  })
  .catch((e) => console.log("Failed to start server", e));
