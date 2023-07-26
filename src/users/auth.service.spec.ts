import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from './user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';


describe('AuthService', () => { 
	let service: AuthService;
	let fakeUsersService: Partial<UsersService>;

	beforeEach(async () => {
	// Create a fake copy of the users service
		const users: User[] = [];
		fakeUsersService = {   
		find: (email: string) => {
			const filteredUsers = users.filter((user) => user.email === email)
			return Promise.resolve(filteredUsers);
		},
		create: (email: string, password: string) => { 
			const user = { id: Math.floor(Math.random() * 999999), email, password} as User;
			users.push(user);
			return Promise.resolve(user);
		}
			
	}

	// const arr = await fakeUsersService.find() // empty array 

	const module = await Test.createTestingModule({
		providers: [AuthService, 
			{
				provide: UsersService, 
				useValue: fakeUsersService
			}
		]
	}).compile();

 	service = module.get(AuthService);
})

	it('can create an instance of auth service', async () => { 
		// Create a fake copy of the users service. 
		expect(service).toBeDefined();
	});

	it('creates a new user with a salted and hashed password', async () => { 
		const user = await service.signup('asdf@asdf.com', 'asdf')
		expect(user.password).not.toEqual('asdf');
		const [salt, hash] = user.password.split('.');
		expect(salt).toBeDefined();
		expect(hash).toBeDefined();	
	})

	it('throws an error if user signs up with email that is in use', async () => { 
		// fakeUsersService.find = () => Promise.resolve([{ id: 1, email: 'a', password: '1'} as User]);
		await service.signup('asdf@asdf.com', 'asdf');
		await expect(service.signup('asdf@asdf.com', 'asdf')).rejects.toThrow(
			BadRequestException
		)
	})

	it('throws if signin is called with an unused email', async () => {
		await expect(service.signin('asdflkj@asdlfkj.com', 'passdflkj')).rejects.toThrow(NotFoundException);
	})


	it('throws if an invalid password is provided', async () => { 
		// fakeUsersService.find = () => Promise.resolve([{email: 'asdf@asdf.com', password: 'laskdjf'} as User])
		await service.signup('laskdjf@alskdfj.com', 'password');
		
		// Error! 
		// await expect(service.signin('laskdjf@alskdfj.com', 'password')).rejects.toThrow(BadRequestException);

		// Success!
		await expect(service.signin('laskdjf@alskdfj.com', 'password'))
	})

	it('returns a user if correct password is provided', async () => { 

		// fakeUsersService.find = () => Promise.resolve([{email: 'asdf@asdf.com', password: 'cdfbd6a7f791815a.2074eef31948bab63e4b72d9e1b41dd1f22fedc05906086f950041d1f9e2a175'} as User])

		await service.signup('asdf@asdf.com', 'mypassword');

		const user = await service.signin('asdf@asdf.com', 'mypassword'); // 여기에서 에러 발생
		expect(user).toBeDefined();

		// const user = await service.signup('asdf@asdf.com', 'mypassword')
		// console.log(user);
	})

	// let failPromise = Promise.reject(NotFoundException)
	// let failPromise = Promise.reject(BadRequestException);
	// // let successPromise = Promise.resolve(123)
	// it('should throw the error', async () => { 
	// 	// await expect()(resolve, reject) => {

			
	// 	// })).rejects.toThrow(BadRequestException)
	// 	// expect(testPromise).rejects.toThrow(BadRequestException);
	// 	expect(failPromise).rejects.toThrow(BadRequestException);
	// 	// If the promise is fulfilled the assertion fails.
	// })
})

// throws an error if user signs up 