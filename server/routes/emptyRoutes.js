import express from "express";
import { rootDir } from "../dirModule.cjs";
import path from "path";
const router = express.Router();

export function emptyRoutes() {
  // router.get("/", function (req, res) {
  //   //console.log("rooooute", req);
  //   res.sendFile(
  //     path.join(rootDir, "..", "quasar", "dist", "spa", "index.html")
  //   );
  // });
  router.get("/start", (req, res) => {
    console.log("start");
    res.send("Privet world: " + req.session?.user?.id);
  });
  // router.get("/user", (req, res) => {
  //   //res.json(data);
  //   req.session.user = { id: 100, name: "proverka tuta" };
  //   res.send("Privet world !!!");
  // });

  return router;
}
