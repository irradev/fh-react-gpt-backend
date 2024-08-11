import { Module } from '@nestjs/common';
import { RoyAssistantService } from './roy-assistant.service';
import { RoyAssistantController } from './roy-assistant.controller';

@Module({
  controllers: [RoyAssistantController],
  providers: [RoyAssistantService],
})
export class RoyAssistantModule {}
