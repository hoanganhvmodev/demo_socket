import { Module } from '@nestjs/common';
import { AppchatService } from './appchat.service';
import { AppchatGateway } from './appchat.gateway';

@Module({
  providers: [AppchatGateway, AppchatService],
  exports: [AppchatGateway, AppchatService],
})
export class AppchatModule {}
