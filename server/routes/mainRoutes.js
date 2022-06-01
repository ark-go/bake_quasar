import { rootDir } from "../dirModule.cjs";
import path from "path";
import { apiRoutes } from "./apiRoutes.js";
import { emptyRoutes } from "./emptyRoutes.js";
let pathmode = process.env.APP_BAKE_MODE;
let vueDir = path.join(rootDir, "..", "quasar", "dist", pathmode); //"spa");
let vueIndex = path.join(vueDir, "index.html");

export async function mainRoutes(app, express) {
  // app.use((req, res, next) => {
  //   console.log("rooooute3", req.headers.origin);
  //   let orig = req.headers.origin;
  //   if (orig && orig.includes("kanpwa.x")) {
  //     vueDir = path.join(rootDir, "..", "quasar", "dist", "pwa");
  //     vueIndex = path.join(vueDir, "index.html");
  //   } else {
  //     vueDir = path.join(rootDir, "..", "quasar", "dist", "spa");
  //     vueIndex = path.join(vueDir, "index.html");
  //   }
  //   next();
  // });

  // app.use((req, res, next) => {
  //   var host = req.get("host"); //  "host" kanserv  nginx ?
  //   if (host == "kanservpwa") {
  //     vueDir = path.join(rootDir, "..", "quasar", "dist", "pwa"); //"spa");
  //     vueIndex = path.join(vueDir, "index.html");
  //   }
  //   //console.log("HOST: ", req.header("Host"));
  //   next();
  // });

  app.use(express.static(vueDir)); // vue static
  //app.use("/", await emptyRoutes()); // будет отвечать
  app.use("/api", await apiRoutes());

  //   app.use("/", (req, res) => {
  //     res.sendFile(vueIndex); // vue start
  //   });
  //console.log("rooooute3", req);

  app.use((req, res, next) => {
    res.sendFile(vueIndex); // vue return
  });
}
