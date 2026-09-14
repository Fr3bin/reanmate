import { Injectable } from '@nestjs/common';
import type { Collection } from 'mongodb';
import { DatabaseService } from '../database/database.service.js';
import type { Chapter, Grade, SubjectId } from './chapter.types.js';

type ChapterDocument = Chapter & { _id?: unknown };

@Injectable()
export class ChaptersService {
  constructor(private readonly database: DatabaseService) {}

  private get collection(): Collection<ChapterDocument> {
    return this.database.db.collection<ChapterDocument>('chapters');
  }

  async ensureIndexes(): Promise<void> {
    await Promise.all([
      this.collection.createIndex({ id: 1 }, { unique: true }),
      this.collection.createIndex({ grade: 1, subject: 1, status: 1, sortOrder: 1 }),
    ]);
  }

  async findApproved(grade: Grade, subject: SubjectId): Promise<Chapter[]> {
    await this.ensureIndexes();
    const chapters = await this.collection
      .find({ grade, subject, status: 'approved' }, { projection: { _id: 0, sourceText: 0 } })
      .sort({ sortOrder: 1 })
      .toArray();
    return chapters.map((chapter) => ({ ...chapter, sourceText: '' }));
  }

  async findById(id: string, includeDrafts = false): Promise<Chapter | null> {
    await this.ensureIndexes();
    const query = includeDrafts ? { id } : { id, status: 'approved' as const };
    const chapter = await this.collection.findOne(query, { projection: { _id: 0 } });
    return chapter ?? null;
  }

  async findAllForAdmin(): Promise<Chapter[]> {
    await this.ensureIndexes();
    return this.collection
      .find({}, { projection: { _id: 0 } })
      .sort({ grade: 1, subject: 1, sortOrder: 1 })
      .toArray();
  }
}
