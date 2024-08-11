import { Body, Controller, Post } from '@nestjs/common';
import { RoyAssistantService } from './roy-assistant.service';
import { QuestionDto } from './dtos/question.dto';

@Controller('roy-assistant')
export class RoyAssistantController {
  constructor(private readonly royAssistantService: RoyAssistantService) {}

  @Post('create-thread')
  async createThread() {
    return await this.royAssistantService.createThread();
  }

  @Post('user-question')
  async userQuestion(@Body() questionDto: QuestionDto) {
    return this.royAssistantService.userQuestion(questionDto);
  }
}
