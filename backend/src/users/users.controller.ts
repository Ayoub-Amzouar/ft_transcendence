import { Controller, ClassSerializerInterceptor,Get, UnauthorizedException,
	BadRequestException, Param, HttpCode, UseGuards, Body, Res } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common';
import { Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { Express } from 'express'
import uploadInterceptor from './upload.interceptor';
import { 
	ApiTags,
	ApiOperation,
	ApiResponse
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AvatarDto } from './dto/upload.dto';
import { jwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';

@ApiTags('users')
@Controller('users')
// @UseGuards(jwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {

	constructor(
		@InjectRepository(User)
		private readonly userRepo : UserRepository,
		private readonly usersService: UsersService
	){}

	@ApiOperation({ summary: 'Change a user\'s avatar' })
	@ApiResponse({
		status: 200, 
		description: 'The uploaded avatar Details',
		type: AvatarDto,
	})
	@Post('/upload_avatar')
	@HttpCode(200)
	@UseInterceptors(uploadInterceptor({
		fieldName: 'file',
		path: '/',
		fileFilter: (req, file, callback) => {
			if (!file.mimetype.includes('images'))
				return callback(new BadRequestException('Provide a valid image'), false);
		},
	}))
	async uploadFile(@Req() req, @UploadedFile() file: Express.Multer.File, @Res() res) {
		const user = await this.usersService.uploadAvatar(req.user.id, {
			filename: file.filename,
			path: file.path,
			mimetype: file.mimetype
		});
		res.send({avatar: user.avatar});
	}
	
	@ApiOperation({ summary: 'Change a user\'s username' })
	@Post('/update_username')
	async updateUsername(@Req() req, @Body('username') newUsername: string){
		try{
			const result = await this.usersService.updateUsername(req.user.id, newUsername);
		}
		catch (err){
			throw new UnauthorizedException('failed to update the username');
		}
	}

	/*
		Friensd Services
	*/

	@ApiOperation({ summary: 'Add a friend to a user' })
	@Post('/add_friend')
	async AddFriend(@Body('username') userID : number, @Req() req: any, @Res() res: any){
		const newFriend = await this.usersService.getUserById(userID);
		console.log(newFriend);
		if (!newFriend)	
			throw new UnauthorizedException('NOT a User');
		const user = await this.usersService.getUserById(58526); //! switch it to req.user.id
		if (!user)
			throw new UnauthorizedException('NOT a User');
		if (!user.FriendsID.includes(newFriend.username)){
			user.FriendsID.push(newFriend.username);
		}
		await this.userRepo.save(user);
		res.end();
	}

	@ApiOperation({ summary: 'Add a friend to a user' })
	@Post('/block_friend')
	async BlockFriend(@Body('username') userID : number, @Req() req: any, @Res() res: any){
		const newFriend = await this.usersService.getUserById(userID);
		console.log(newFriend);
		if (!newFriend)
			throw new UnauthorizedException('NOT a User');
		const user = await this.usersService.getUserById(58526); //! switch it to req.user.id
		if (!user)
			throw new UnauthorizedException('NOT a User');
		if (!user.FriendsID.length || !user.FriendsID.includes(newFriend.username)){
			throw new UnauthorizedException('User is not Friend OR Already blocked');
		}
		// this.usersService.removeFriend(newFriend);
		if (!user.blockedID.includes(newFriend.username))
		{
			if (!user.blockedID.length)
				user.blockedID = [newFriend.username];
			else
				user.blockedID.push(newFriend.username);
		}
		else
			throw new UnauthorizedException('User Already blocked');
		await this.userRepo.save(user);
		res.end();
	}

	@ApiOperation({ summary: 'get friends list'})
	@Get('/friends_list')
	async friendsList(@Req() req: any, @Res() res: any){
		const user = await this.usersService.getUserById(58526); //! switch it to req.user.id
		if (!user)
			throw new BadRequestException("user does not exist");
		const friends = await this.userRepo
		.createQueryBuilder("db_user")
		.select(['db_user.username', 'db_user.avatar' ,'db_user.id', 'db_user.status'])
		.where(":id = ANY (db_user.FriendsID)", {id: user.id})
		.getMany()
		res.send(friends);
	}

	@ApiOperation({ summary: 'get friends list'})
	@Get('/blocked_list')
	async blockedFriend(@Req() req: any, @Res() res: any){
		const user = this.usersService.getUserById(58526); //! switch it to req.user.id
		if (!user)
			throw new BadRequestException("user does not exist");
		const friends = await this.userRepo
		.createQueryBuilder("db_user")
		.select(['db_user.username', 'db_user.avatar' ,'db_user.id', 'db_user.status'])
		.where(":id = ANY (db_user.blockedID)", {id: 58526})
		.getMany()
		res.send(friends);
	}

	// TODO:
	// add user > done
	// get friends > done
	// block user 
	// get blocked users > done 
	// get friend > can be done with get user

	@ApiOperation({ summary: 'Get user data by id' })
	@ApiResponse({
		status: 200,
		description: 'The found record',
		type: User,
	})
	@Get(':id')
	getUserData(@Param('id') id : number){
		return this.usersService.getUserById(id);
	}

}