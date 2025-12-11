import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { CurriculumController } from './curriculum.controller';
import { CurriculumService } from './curriculum.service';

@Module({
  controllers: [CoursesController, CurriculumController],
  providers: [CoursesService, CurriculumService],
  exports: [CoursesService, CurriculumService],
})
export class CoursesModule {}

