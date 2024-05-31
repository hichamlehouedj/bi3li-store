import { Server }   from "socket.io";
import RandToken from 'rand-token';

import { AuthMiddlewareSocket } from "../middlewares/index.js";
import dayjs from "dayjs";

const { uid } = RandToken;

const UNAUTHORIZED = 'You must be the authenticated user to get this information'


export class socketServer {
    io: any
    onlineUsers: string[]
    socketConnect: any
    socketConnectAdmins: any

    constructor(httpServer) {
        this.io = new Server(httpServer, {
            path: "/socket.io/",
            cors: {
                origin: ["http://localhost:3000"]
            },
            // @ts-ignore
            credentials: true
        });

        //instrument(this.io, { auth: false })
        this.onlineUsers = [];
        this.socketConnect = null;
    }

    async getIds(id, onlineUsers: string[]) {
        let data = []
        for (let i = 0; i < onlineUsers.length; i++) {
            if (onlineUsers[i].split("_")[1] === id) {
                data.push(onlineUsers[i])
            }
        }
        return data;
    }

    socketConfig () {
        this.io.use( async (socket, next)=>{
            const nowDate = new Date();
            const dateConnection = dayjs(nowDate).format("yyyy-mm-dd HH:MM:ss");

            let token = socket.handshake.auth.token || "";

            let Authorization = await AuthMiddlewareSocket(token)

            // if (!Authorization) {
            //     return next(new Error('You must be the authenticated user'));
            // }

            if (!socket.handshake.query.userId) {
                console.log("*** No date config ***")
                return next(new Error("date config empty"));
            }

            const newID = `${uid(3)}_${socket.handshake.query.userId}`;
            socket['id'] = newID

            next();
        });
    }

    async connection() {
        this.socketConfig();
        this.socketConnect = await this.io.on('connection', async (socket) => {
            console.log("===================== Main connection ========================")
            await this.socketInfo(socket)
            
            //this.socketPacketCreate(socket)
            //this.socketPacket(socket)
            //this.socketUpgrade(socket)
            this.socketError(socket);
            this.socketDisconnect(socket);
            return await socket
        })
    }

    async socketInfo(socket) {
        let fetchSockets = await this.io.fetchSockets()
        this.onlineUsers = [];
        fetchSockets.map(socket => {
            this.onlineUsers.push(socket.id)
        });
        // console.log({"onlineUsers": this.onlineUsers})
    }

    async newOrder(to: any, data: any) {
        // console.log("newOrder ", {to, data})
        // const Ids = await this.getIds(to, this.onlineUsers)
        // console.log({Ids})

        // if (Ids && Ids.length > 0) {
        //     this.socketConnect.to(this.onlineUsers).emit("newOrder", data)
        // }
        this.socketConnect.to(this.onlineUsers).emit("newOrder", data)
    }

    socketError(socket) {
        socket.on("error", (err) => {
            console.log("error", err)
            if (err && err.message === UNAUTHORIZED) {
                socket.disconnect();
            }
            if (err && err.message === "date config empty") {
                socket.disconnect();
            }
        })
    }

    socketDisconnect(socket) {
        socket.on('disconnect',async (data)=>{
            const nowDate = new Date();
            // const dateDisconnect = dayjs(nowDate).format("yyyy-mm-dd HH:MM:ss");

			// if (socket.id.split("_")[1] != "undefined") {
            //     const content = {lastDisconnection: new Date()}
            //     await User.update(content, {
			// 		where: { id:  socket.id.split("_")[1] }
			// 	})
			// }
            console.info(`${new Date()}  | visitor ${socket.id} disconnected 🖐🖐🖐`);
            this.onlineUsers = this.onlineUsers.filter(user => user != socket.id);
        });
    }
}