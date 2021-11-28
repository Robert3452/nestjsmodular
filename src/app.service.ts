import { Injectable, Inject } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import config from './config';
import { Client } from 'pg';
@Injectable()
export class AppService {

  constructor(
    // @Inject('API_KEY') private apiKey: string,
    // @Inject('TASKS') private tasks: any[],
    @Inject(config.KEY) private configService: ConfigType<typeof config>,
    @Inject('PG') private clientPg: Client
  ) { }

  getHello(): string {
    const apiKey = this.configService.apiKey;
    const dbHost = this.configService.database.name;
    const dbPort = this.configService.database.port;
    return `Hello World! ${apiKey} ${dbHost} ${dbPort}`;
  }

  getTasks() {
    return new Promise((resolve, reject) => {
      this.clientPg.query('SELECT * FROM tasks', (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res.rows);
      });
    })
  }
}
