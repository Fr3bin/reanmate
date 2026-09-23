import { BadRequestException, Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { Public, Roles } from '../auth/auth.decorators.js';
import { ChaptersService } from './chapters.service.js';
import type { Chapter, Grade, SubjectId } from './chapter.types.js';

const GRADES: Grade[] = [10, 11, 12];
const SUBJECTS: SubjectId[] = ['math', 'history'];

@Controller()
export class ChaptersController {
  constructor(private readonly chapters: ChaptersService) {}

  @Public()
  @Get('chapters')
  async approvedChapters(
    @Query('grade') gradeParam: string,
    @Query('subject') subjectParam: SubjectId,
  ): Promise<Chapter[]> {
    const grade = Number(gradeParam) as Grade;
    if (!GRADES.includes(grade) || !SUBJECTS.includes(subjectParam)) {
      throw new BadRequestException('Invalid grade or subject.');
    }
    return this.chapters.findApproved(grade, subjectParam);
  }

  @Public()
  @Get('chapters/:id')
  async chapter(@Param('id') id: string): Promise<Chapter> {
    const chapter = await this.chapters.findById(id);
    if (!chapter) throw new NotFoundException('Chapter not found.');
    return chapter;
  }

  @Roles('admin')
  @Get('admin/chapters')
  async adminChapters(): Promise<Chapter[]> {
    return this.chapters.findAllForAdmin();
  }
}
