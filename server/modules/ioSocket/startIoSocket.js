import { Server as ioServer } from "socket.io";
//import Redis from "ioredis";
import { createAdapter } from "@socket.io/redis-adapter";
import { onConnection } from "./onConnection.js";
import { redisClientIoSocket } from "../../utils/ioredisStoreMSK.js";
//import { redisClient } from "../../utils/ioredisStore.js";
//const { createAdapter } = require("@socket.io/redis-adapter");
export let io = null;
export function startIoSocket(serverHTTP, expressSession, app) {
  // console.log("redis to", process.env.Redis_ioSocket);
  // const pubClient = new Redis({ host: process.env.Redis_ioSocket, port: 6379 });

  io = new ioServer(serverHTTP, {
    // maxHttpBufferSize: 1e8, // читать.. по умолчанию 1мб полезная нагрузка итаймаут
    // pingTimeout: 60000, // если большой размер, ошибки пинга вызывают отключение.. время можно увеличить
    cors: {
      // origin: "" // наш адрес сюда с портом
      methods: ["GET", "POST"],
      credentials: true,
    },
  });
  app.socketIo = io; //! Не знаю...
  //console.log("старт ioSocket");
  if (redisClientIoSocket) {
    console.log(
      "Cтарт redis adapter for ioSocket",
      redisClientIoSocket?.connector?.options?.host
    );
    const pubClient = redisClientIoSocket;
    const subClient = pubClient.duplicate();
    // Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
    //   io.adapter(createAdapter(pubClient, subClient));
    // });
    //  Promise.all([subClient.connect()]).then(() => {
    io.adapter(createAdapter(pubClient, subClient));
    // });
  }
  // convert a connect middleware to a Socket.IO middleware
  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);
  // заберем session нашу из http запросов
  io.use(wrap(expressSession));

  // разрешить только аутентифицированным пользователям
  io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.user) {
      next();
    } else {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log("io connection");
    //! для чегото это надо, https://socket.io/how-to/use-with-express-session#modifying-the-session
    const req = socket.request;
    socket.use((__, next) => {
      req.session.reload((err) => {
        if (err) {
          socket.disconnect();
        } else {
          next();
        }
      });
    });
    onConnection(io, socket);
  });
  // io.of("/").adapter.on("redis", (room) => {
  //   console.log(`room ${room} was created`);
  // });
  io.engine.on("connection_error", (err) => {
    // console.log(err.req); // the request object
    console.log("IO err code", err.code); // the error code, for example 1
    console.log("IO mess", err.message); // the error message, for example "Session ID unknown"
    console.log("IO context", err.context); // some additional error context
  });
}
// отключить все соединения Socket.IO, связанные с этим  session ID
//io.to(sessionId).disconnectSockets();
