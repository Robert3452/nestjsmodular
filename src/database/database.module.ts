import { Client } from 'pg';

import { Module, Global } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from '../config';
const API_KEY = '1234567890';
const API_KEY_PROD = 'secretKey#$23';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const {
          dbName: database,
          password,
          host,
          user,
          port,
        } = configService.postgres;

        return {
          type: 'postgres',
          host,
          port,
          username: user,
          password,
          database,
          synchronize: false, // WARNING: en producción no se debería utilizar el valor en true es preferible usar migraciones
          autoLoadEntities: true,
        };
      },
      inject: [config.KEY],
    }),
  ],
  providers: [
    {
      provide: 'API_KEY',
      useValue: process.env.NODE_ENV === 'prod' ? API_KEY_PROD : API_KEY,
    },
    {
      provide: 'PG',
      useFactory: (configService: ConfigType<typeof config>) => {
        const {
          dbName: database,
          password,
          host,
          user,
          port,
        } = configService.postgres;

        const client = new Client({
          user,
          password,
          host,
          database,
          port,
        });

        client.connect();
        return client;
      },
      inject: [config.KEY],
    },
  ],
  exports: ['API_KEY', 'PG', TypeOrmModule],
})
export class DatabaseModule {}
