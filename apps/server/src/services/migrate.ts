import { migrations } from "../migrations";
import { exec } from "child_process";
import { DATABASE_SCHEMA, DATABASE_URL } from "../config";
import { db } from "./db";

export const migrate = async () => {
  const command = `npx pg-taskq up -c "${DATABASE_URL}" -s "${DATABASE_SCHEMA}" -f`;
  await new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      console.log(stdout);
      console.error(stderr);
      if (stderr) {
        reject(stderr);
      } else {
        resolve(true);
      }
    });
  });
  await Promise.all(migrations.map((query) => db.query(query)));
};
