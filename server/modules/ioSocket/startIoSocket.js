import { Server as ioServer } from "socket.io";

export function startIoSocket(serverHTTP, expressSession) {
  const io = new ioServer(serverHTTP, {
    cors: {
      // origin: "" // наш адрес сюда с портом
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // convert a connect middleware to a Socket.IO middleware
  const wrap = (middleware) => (socket, next) =>
    middleware(socket.request, {}, next);

  io.use(wrap(expressSession));

  // only allow authenticated users
  io.use((socket, next) => {
    const session = socket.request.session;
    if (session && session.user) {
      next();
    } else {
      next(new Error("unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    console.log(socket.request.session);
    console.log("IO Подключился:", socket.request?.session?.user?.email);
    console.log("Кол-во клиентов", io.engine.clientsCount);
    socket.data.username = "alice"; // в data сувать что хочешь

    socket.on("disconnect", (reason) => {
      //https://socket.io/docs/v4/server-api/#event-disconnect
      console.log("IO Отключился Причина:", reason);
      console.log("Кол-во клиентов", io.engine.clientsCount);
    });
  });

  io.engine.on("connection_error", (err) => {
    console.log(err.req); // the request object
    console.log(err.code); // the error code, for example 1
    console.log(err.message); // the error message, for example "Session ID unknown"
    console.log(err.context); // some additional error context
  });
}
