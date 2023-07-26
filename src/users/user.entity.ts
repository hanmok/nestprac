import { Entity, Column, PrimaryGeneratedColumn, AfterInsert, AfterRemove, AfterUpdate } from 'typeorm';
// import { Exclude } from 'class-transformer';

@Entity()
export class User { // Convention. (or UserEntity)
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	password: string;

	// Hook ups
	@AfterInsert() 
	logInsert() { 
		console.log('Inserted User with id', this.id)
	}

	@AfterUpdate()
	logUpdate() { 
		console.log('Updated User with id', this.id);
	}

	@AfterRemove() 
	logRemove() { 
		console.log('Removed User with id', this.id);
	}	
} 