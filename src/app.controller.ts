import { Controller, Get, Render, Redirect, Res, BadRequestException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(
			private readonly appService: AppService,
		) {}
 
	@Get()
	@Render('index')
	root(){
		return ({message: 'hehe'});
	}

	@Get('/auth_page')
	@Redirect()
	getAuthPage(){
		return { 
			url: 'https://api.intra.42.fr/oauth/authorize?client_id=49a4b98742acf9bf17d4d7299520cad7fc235f437be130d267a93f39a1444185&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth%2Flogin&response_type=code'
		};	
	}
}
 