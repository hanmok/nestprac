import { DataSource, DataSourceOptions } from "typeorm";

export const appDataSource: DataSourceOptions = {
	type: 'sqlite', 
	database: 'db.sqlite',
	entities: ['**/*.entity.ts'],
	migrations: [__dirname + '/migrations/*.ts'],
}

const sth = new DataSource(appDataSource);

export default sth

