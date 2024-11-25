import { Module } from '@nestjs/common';
import { moduleFactory } from '@onivoro/server-common';
import { KinesisClient } from '@aws-sdk/client-kinesis';
import { KinesisService } from './services/kinesis.service';
import { ServerAwsKinesisConfig } from './classes/server-aws-kinesis-config.class';

let kinesisClient: KinesisClient | null = null;

@Module({})
export class ServerAwsKinesisModule {
  static configure(config: ServerAwsKinesisConfig) {
    return moduleFactory({
      module: ServerAwsKinesisModule,
      providers: [
        {
          provide: KinesisClient,
          useFactory: () => kinesisClient
            ? kinesisClient
            : kinesisClient = new KinesisClient({
              region: config.AWS_REGION,
              logger: console,
              credentials: config.NODE_ENV === 'production'
                ? undefined
                : {
                  accessKeyId: config.AWS_ACCESS_KEY_ID,
                  secretAccessKey: config.AWS_SECRET_ACCESS_KEY
                }
            })
        },
        { provide: ServerAwsKinesisConfig, useValue: config },
        KinesisService
      ]
    })
  }
}
