//@ts-ignore
import { io, Socket } from "socket.io-client";
import Emitter from "./Emitter";
import Cookies from 'universal-cookie';

const cookies = new Cookies(null, { path: '/' });

export default class SocketClient {
    static io?: Socket;
    id?: string;
    idUser?: string;

    constructor({ idUser }: any) {
        try {
            this.idUser = idUser
            const token = cookies.get('token');

            const url = process.env.REACT_APP_SOCKET_URL as string;

            SocketClient.io = io(url, {
                path: "/socket.io",
                autoConnect: true,
                transports: ["websocket"],
                withCredentials: true,
                query: {
                    userId: idUser,
                },
                auth: {
                    token: token ? `${token}` : "",
                },
            });
        } catch (error) {
            alert(`Something went wrong; Can't connect to socket server`);
        }
    }

    disconnect() {
        SocketClient?.io?.disconnect();
    }

    connect() {
        SocketClient?.io?.on("connect", async () => {
            this.id = SocketClient?.io?.id;
        });

        SocketClient?.io?.on("connect_error", (err: any) => {
            console.log("connect_error =>", new Error(err.toString()).message);
        });

        SocketClient?.io?.on("error", (error: any) => {
            console.log("Socket Client error", error);
        });

        SocketClient?.io?.on("newOrder", (data: any) => {
            Emitter.emit("newOrder", data)
            return data
        });
    }
}


export const socket = (id: string) => {
    const socketClient = new SocketClient({
        idUser: id,
    });

    return { socketClient }
}