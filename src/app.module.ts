// import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
// import { APP_PIPE } from '@nestjs/core';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { ReportsModule } from './reports/reports.module';
// import { UsersModule } from './users/users.module';
// import { User } from './users/user.entity';
// import { Report } from './reports/report.entity';
// const cookieSession = require('cookie-session');

// // @Module({
// //   imports: [ 
// //     ConfigModule.forRoot({
// //       isGlobal: true,
// //       envFilePath: `.env.${process.env.NODE_ENV}` 
// //     }),
// //   TypeOrmModule.forRoot(),

// //     // TypeOrmModule.forRootAsync({
// //     //   inject: [ConfigService],
// //     //   useFactory: (config: ConfigService) => { 
// //     //     return {
// //     //       type: 'sqlite', 
// //     //       database: config.get<string>('DB_NAME'),
// //     //       synchronize: true, 
// //     //       entities: [User, Report]
// //     //     }
// //     //   }
// //     // }),
 
// //   //   TypeOrmModule.forRoot({
// //   //   type: 'sqlite',
// //   //   database: 'db.sqlite',
// //   //   // database: process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'db.sqlite',
// //   //   entities: [User, Report],
// //   //   synchronize: true
// //   // }),


// //     ReportsModule, 
// //     UsersModule
// //   ], 
// //   controllers: [AppController],
// //   providers: [
// //     AppService,
// //     {
// //       provide: APP_PIPE,
// //       useValue: new ValidationPipe({
// //         whitelist: true
// //       })
// //     }
// //   ],
// // })


// @Module({
//   imports: [
//     ConfigModule.forRoot({
//       isGlobal: true,
//       envFilePath: `.env.${process.env.NODE_ENV}`,
//     }),
//     TypeOrmModule.forRoot(),
//     UsersModule,
//     ReportsModule,
//   ],
//   controllers: [AppController],
//   providers: [
//     AppService,
//     {
//       provide: APP_PIPE,
//       useValue: new ValidationPipe({
//         whitelist: true,
//       }),
//     },
//   ],
// })


// export class AppModule {

//   constructor(private configService: ConfigService) {}

//   configure(consumer: MiddlewareConsumer) { 
//     consumer.apply(cookieSession({
//       keys: [this.configService.get('COOKIE_KEY')],
      
//     })).forRoutes('*');
//   }
// }


import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { User } from './users/user.entity';
import { Report } from './reports/report.entity';
import { TypeOrmConfigService } from './config/typeorm.config';
const cookieSession = require('cookie-session');
// const dbConfig = require('../ormconfig');

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService
    }),
    UsersModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(
        cookieSession({
          keys: [this.configService.get('COOKIE_KEY')],
        }),
      )
      .forRoutes('*');
  }
}
