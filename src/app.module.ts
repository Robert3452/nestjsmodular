import { Module } from '@nestjs/common';
import { HttpService, HttpModule } from '@nestjs/axios';
import * as Joi from 'joi';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config'
import { enviroments } from './enviroments';
import config from './config';
// nest g module users
// nest g module products
@Module({
  imports: [UsersModule,
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV || "dev"],
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        API_KEY: Joi.number().required(),
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required()
      })
    }),
    DatabaseModule,
    ProductsModule,
    HttpModule,
    DatabaseModule],
  controllers: [AppController],
  providers: [
    // usClass
    AppService,
    // UseValue
    // {
    // provide: 'API_KEY',
    // useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY
    // },
    // UseFactory
    {
      provide: 'TASKS',
      useFactory: async (http: HttpService) => {
        //Es recomendable no usarlo en apis si puede ser usado en conexión de bases de datos
        const tasks = await http
          .get('https://jsonplaceholder.typicode.com/todos')
          .toPromise();
        return tasks.data;
      },
      inject: [HttpService]
    }
  ],
})
export class AppModule { }
