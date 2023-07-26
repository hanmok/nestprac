import { Body, Controller, Post, Get, Patch, Delete, Param, Query, NotFoundException, 
	// UseInterceptors, 
	ClassSerializerInterceptor, Session,
	UseGuards
} from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UsersService } from './users.service';
// import { SerializeInterceptor } from '../interceptors/serialize.interceptor';
import { Serialize } from '../interceptors/serialize.interceptor'; 
import { UserDto } from './dtos/user.dto';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorators/current-user.decorator'
// import { CurrentUserInterceptor } from './interceptors/current-user.interceptor';
import { User } from './user.entity';
import { AuthGuard } from '../guards/auth.guard';


@Controller('/auth')
@Serialize(UserDto)
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
	constructor(private usersService: UsersService, 
				private authService: AuthService
		) {}

	// @Get('/whoami')
	// whoAmI(@Session() session: any) { 
	// 	return this.usersService.findOne(session.userId);
	// }

	@Get('/whoami')
	@UseGuards(AuthGuard)
	whoAmI(@CurrentUser() user: User) {
		return user;
	}

	// @Get('/whoami')
	// whoAmI(@Request() request: Request) { 
	// 	request.currentUser
	// 	return this.user;
	// }

	@Post('/signout')
	signOut(@Session() session: any) { 
		session.userId = null;
	}

	@Get('/colors/:color')
	setColor(@Param('color') color: string, @Session() session: any) { 
		session.color = color;
	}

	@Get('/colors')
	getColor(@Session() session: any) { 
		return session.color;
	}
		
	@Post('/signup')
	async createUser(@Body() body: CreateUserDto, @Session() session: any) {
		const user = await this.authService.signup(body.email, body.password)
		session.userId = user.id
		return user;
	}
	// /users/

	@Post('/signin')
	async signin(@Body() body: CreateUserDto, @Session() session: any) {
		 const user = await this.authService.signin(body.email, body.password);
		 session.userId = user.id
		 return user;
	}

	// '/auth/123123123'
	@Get('/:id')
	async findUser(@Param('id') id: string) { 
		const user = await this.usersService.findOne(parseInt(id))
		if (!user) { 
			throw new NotFoundException('user not found');
		}
		return user;
		// return this.usersService.findOne(parseInt(id));
	}

	// @Serialize(UserDto)
	@Get()
	findAllUsers(@Query('email') email: string) { 
		return this.usersService.find(email);
	}

	@Delete('/:id')
	removeUser(@Param('id') id: string) {
		return this.usersService.remove(parseInt(id));
	}	

	@Patch('/:id')
	updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) { 
		return this.usersService.update(parseInt(id), body);
	}
}


