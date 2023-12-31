import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt); 


@Injectable() 
export class AuthService {
	constructor(private usersService: UsersService) {}
	
	async signup(email: string, password: string) {
		// See if email is in use
		const users = await this.usersService.find(email);
		if (users.length) { 
			throw new BadRequestException('email in use');
		}
		
		// Hash the users password
		// Generate a salt (// 1 byte: 2 character)
		// Hash the salt and the password together
		// Join the hashed result and the salt together. 
		// Create a new user and save it
		// return the user 
		const salt = randomBytes(8).toString('hex');
		const hash = (await scrypt(password, salt, 32)) as Buffer;
		const result = salt + '.' + hash.toString('hex');
		const user = await this.usersService.create(email, result);
		return user; 
	}

	async signin(email: string, password: string) {
		const [user] = await this.usersService.find(email);
		if (!user) { 
			throw new NotFoundException('user not found');
		} 
		// DB 에 저장되어있는 값
		const [salt, storedHash] = user.password.split('.');
  
		// user input 으로부터 만든 hash 
		const hash = (await scrypt(password, salt, 32)) as Buffer;


		if (storedHash !== hash.toString('hex')) { 
			throw new BadRequestException('bad password');
		} 
		return user;
	}
}