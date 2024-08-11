import { Module } from '@nestjs/common';
import { GptModule } from './gpt/gpt.module';
import { ConfigModule } from '@nestjs/config';
import { RoyAssistantModule } from './roy-assistant/roy-assistant.module';

@Module({
  imports: [ConfigModule.forRoot(), GptModule, RoyAssistantModule],
})
export class AppModule {}
