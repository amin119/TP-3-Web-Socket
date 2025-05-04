import { Injectable } from '@nestjs/common';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Skill } from './entities/skill.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SkillService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  findAll() {
    return this.skillRepository.find();
  }

  create(skillData: Partial<Skill>) {
    const newSkill = this.skillRepository.create(skillData);
    return this.skillRepository.save(newSkill);
  }

  findOne(id: number): Promise<Skill | null> {
    return this.skillRepository.findOneBy({ id });
  }

  async update(id: number, dto: UpdateSkillDto): Promise<Skill | null> {
    await this.skillRepository.update(id, dto);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    await this.skillRepository.delete(id);
  }

  findByDesignation(keyword: string): Promise<Skill[]> {
    return this.skillRepository.find({
      where: { Designation: keyword },
    });
  }
}
