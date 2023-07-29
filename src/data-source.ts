import { DataSource, DataSourceOptions } from "typeorm";

// export const appDataSource: DataSourceOptions = {
const appDataSource: DataSourceOptions = {
	type: 'sqlite', 
	database: 'db.sqlite',
	entities: ['**/*.entity.ts'],
	migrations: [__dirname + '/migrations/*.ts'],
}

switch (process.env.NODE_ENV) { 
	case 'development':
		Object.assign(appDataSource, { 
			type: 'sqlite',
			database: 'db.sqlite',
			entities: ['**/*.entity.js']
		})
		break;
	case 'test':
		Object.assign(appDataSource, { 
			type: 'sqlite',
			database: 'test.sqlite',
			entities: ['**/*.entity.ts'],
			migrationsRun: true
		})
		break;
	case 'production':
		break
	default:
		throw new Error('unknown environment');
}

const sth = new DataSource(appDataSource);

export default sth

