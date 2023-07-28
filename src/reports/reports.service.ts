import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './report.entity';
import { CreateReportDto } from './dtos/create-report.dto'
import { User } from '../users/user.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';


@Injectable()
export class ReportsService {
	constructor(@InjectRepository(Report) private repo: Repository<Report>) {}

	// createEstimate(estimateDto: GetEstimateDto) { 
		createEstimate({make, model, lng, lat, year, mileage }: GetEstimateDto) { 
		return this.repo.createQueryBuilder()
		// .select('*') // :make: come from following object
		.select('AVG(price)', 'price')
		.where('make = :make', {make: make})
		.andWhere('model = :model', { model }) // where -> Override;;
		.andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
		.andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
		.andWhere('year - :year BETWEEN -3 AND 3', { year })
		.andWhere('approved IS TRUE')
		.orderBy('ABS(mileage - :mileage)', 'DESC') // does not take object as second object
		.setParameters({ mileage })
		.limit(3)
		.getRawOne() // we are getting AVG
	}

	create(reportDto: CreateReportDto, user: User) { 
		const report = this.repo.create(reportDto)
		report.user = user;
		return this.repo.save(report);
	}

	async changeApproval(id: string, approved: boolean) {
		// const report = await this.repo.findOne(id);
		const report = await this.repo.findOne({where: { id: parseInt(id)}});
		if (!report) { 
			throw new NotFoundException('report not found');
		}

		report.approved = approved;
		return this.repo.save(report);
	}

}
