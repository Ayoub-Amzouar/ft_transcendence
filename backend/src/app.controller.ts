import { Controller, Get, Render, Redirect, Res, Post } from '@nestjs/common';
import {
	ApiOperation,
	ApiTags
}from '@nestjs/swagger'
import { AppService } from './app.service';
import { Response } from 'express';

@ApiTags('app')
@Controller()
export class AppController {
	constructor(
			private readonly appService: AppService,
		) {}

	@ApiOperation({ summary: 'Redirect to the authorization page of the intra Api' })
	@Get('/authentication_page')
	@Redirect()
	async getAuthPage(@Res() response: Response){
		return { 
			url: 'https://api.intra.42.fr/oauth/authorize?client_id=49a4b98742acf9bf17d4d7299520cad7fc235f437be130d267a93f39a1444185&redirect_uri=http%3A%2F%2Flocalhost%3A3005%2Fauth%2Flogin&response_type=code'
		};	
	}

}
 