import { Entity, 
	Column, 
	PrimaryGeneratedColumn, 
	AfterInsert, 
	AfterRemove, 
	AfterUpdate,
	OneToMany
} from 'typeorm';

import { Report } from '../reports/report.entity';
// import { Exclude } from 'class-transformer';

console.log(Report);

@Entity()
export class User { // Convention. (or UserEntity)
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	email: string;

	@Column()
	password: string;

	@Column({ default: true})
	admin: boolean;

	@OneToMany(() => Report, (report) => report.user)
	reports: Report[];

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