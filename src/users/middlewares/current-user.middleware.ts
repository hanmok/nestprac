import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users.service';
import { User } from '../user.entity';

declare global { 
	namespace Express { // go and find express library
		interface Request { // find interface 'Request' over there
			currentUser?: User; // add currentUser to that interface
		}
	}
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware { 
	constructor( 
		private usersService: UsersService) {}
	
	async use(req: Request, res: Response, next: NextFunction) { 
		const { userId } = req.session || {};
		
		if (userId) { 
			const user = await this.usersService.findOne(userId);
			req.currentUser = user; 
		}

		next();
	}
}