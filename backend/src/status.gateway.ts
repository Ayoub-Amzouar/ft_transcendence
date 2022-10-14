import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { UsersService } from './users/users.service';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
	namespace: "status",
	cors: {
		origin: '*',
	}
})
export class StatusGateway implements OnGatewayDisconnect {

	constructor( private readonly userServ: UsersService ) {}
	@WebSocketServer()
	server: Server;


	private logger: Logger = new Logger("StatusGateway");

	private	users = {};

	hasUserid(userId: number): boolean
	{
		let		found: boolean = false;

		for (const property in this.users) {
			if (this.users[property][0] === userId)
			{
				found = true;
				break ;
			}
		}
		return (found);
	}

	getUserStatus(userId: number): string
	{
		let		status: string;

		for (const property in this.users)
		{
			if (this.users[property][0] === userId)
			{
				status = this.users[property][1];
				if (status === "offline")
					delete this.users[property];
				break ;
			}
		}
		return (status);
	}

	async handleDisconnect(client: any) {
		this.logger.log(client.id + " Disconnected");

		if (this.users[client.id])
		{
			const	userId: number = this.users[client.id][0];

			delete this.users[client.id];
			if (!this.hasUserid(userId))
			{
				this.server.emit("UserStatusChanged", {userId: userId, status: "offline"});
				await this.userServ.updateStatus(userId, "offline");
			}
			else
			{
				const	status: string = this.getUserStatus(userId);

				this.server.emit("UserStatusChanged", {userId: userId, status: status});
				await this.userServ.updateStatus(userId, status);
			}
		}
	}

	@SubscribeMessage("userId")
	async handleUserId(client: any, userId: number)
	{
		this.logger.log(`userId event got fired by: ${userId}, status: online`);
		if (userId)
		{
			if (!this.hasUserid(userId))
			{
				this.server.emit("UserStatusChanged", {userId: userId, status: "online"});
				await this.userServ.updateStatus(userId, "online");
			}
			this.users[client.id] = [userId, "online"];
		}
	}

	@SubscribeMessage("inGame")
	async handleInGame(client: any, {userId, status})
	{
		if (this.users[client.id])
		{
			this.users[client.id][1] = status;
			this.server.emit("UserStatusChanged", {userId: userId, status: status});
			await this.userServ.updateStatus(Number(userId), status);
			this.logger.log(`inGame event got fired by: ${userId}, status: ${status}`);
		}
	}

	@SubscribeMessage("logOut")
	async handleLogOut(client: any, userId)
	{
		this.logger.log(`logOut event got fired by: ${userId}, status: offline`);
		for (const property in this.users)
		{
			if (this.users[property][0] === userId)
				this.users[property][1] = "offline";
		}
		if (userId)
		{
			this.server.emit("UserStatusChanged", {userId: userId, status: "offline"});
			await this.userServ.updateStatus(userId, "offline");
		}
	}

}
