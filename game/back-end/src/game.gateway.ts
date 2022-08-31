import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
	namespace: "game",
	cors: {
		origin: '*',
	}
})
export class GameGateway {

	private	userCounter1: number;
	private	roomCounter1: number;
	private	userCounter2: number;
	private	roomCounter2: number;
	constructor() { this.userCounter1 = 0; this.roomCounter1 = 1; this.userCounter2 = 0; this.roomCounter2 = 1000000000;}

	@WebSocketServer()
	server: Server;

	@SubscribeMessage('message')
	handleMessage(client: any, payload: any): string {
		return 'Hello world!';
	}

	@SubscribeMessage("joinTheme1")
	handleJoinTheme1(client: Socket): void {
		let roomName: string = "Room #" + this.roomCounter1;

		this.userCounter1++;
		client.join(roomName);
		if (this.userCounter1 === 2)
		{
			this.userCounter1 = 0;
			this.roomCounter1 = (this.roomCounter1 + 1) % 1000000000;
		}
		client.emit("joinedRoom", roomName);
	}

	@SubscribeMessage("joinTheme2")
	handleJoinTheme2(client: Socket): void {
		let roomName: string = "Room #" + this.roomCounter2;

		this.userCounter2++;
		client.join(roomName);
		if (this.userCounter2 === 2)
		{
			this.userCounter2 = 0;
			this.roomCounter2++;
			if (this.roomCounter2 > 2000000000)
				this.roomCounter2 = 1000000000;
		}
		client.emit("joinedRoom", roomName);
	}

	@SubscribeMessage("leaveRoom")
	handleLeaveRoom(client: Socket, room: string, theme: string): void {
		if (theme === "theme1")
			this.userCounter1--;
		else
			this.userCounter2--;
		client.leave(room);
	}

}
