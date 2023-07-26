import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';

@Injectable() 
export class UsersService {
	// Generic Type 을 쓰기때문에 @InjectRepository 가 필요. 
	constructor(@InjectRepository(User) private repo: Repository<User>) { 
		
	}

	create(email: string, password: string) {
		// check validation creating user instance. 
		const user = this.repo.create({email, password});
		return this.repo.save(user);

		// return this.repo.save({email, password});
	}

	findOne(id: number) {
		if (!id) { 
			return null
		}
		return this.repo.findOneBy({id}); 
	}

	find(email: string) { 
		// return array (if no, return empty array)
		return this.repo.find({where: {email}}); 
	}
 
	async update(id: number, attrs: Partial<User>) {
		const user = await this.findOne(id);
		if (!user) { 
			// throw new Error('user not found');
			throw new NotFoundException('user not found');
		}
		// Object.assign()
		Object.assign(user, attrs);
		return this.repo.save(user);
	}

	async remove(id: number) {
		const user = await this.findOne(id);
		if (!user) { 
			throw new NotFoundException('user not found');
		}
		return this.repo.remove(user);
	}
}
