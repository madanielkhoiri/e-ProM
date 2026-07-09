import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './project.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private readonly projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto) {
    const project = this.projectRepository.create(createProjectDto);
    return this.projectRepository.save(project);
  }

  async findAll(search?: string) {
    if (search) {
      return this.projectRepository.find({
        where: [
          { nama_project: Like(`%${search}%`) },
          { deskripsi: Like(`%${search}%`) },
          { pic: Like(`%${search}%`) },
          { created_by: Like(`%${search}%`) },
        ],
        order: { created_at: 'DESC' },
      });
    }

    return this.projectRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number) {
    const project = await this.projectRepository.findOne({
      where: { project_id: id },
    });

    if (!project) {
      throw new NotFoundException('Project tidak ditemukan');
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    const project = await this.findOne(id);

    Object.assign(project, updateProjectDto);

    return this.projectRepository.save(project);
  }

  async remove(id: number) {
    const project = await this.findOne(id);

    await this.projectRepository.remove(project);

    return {
      message: 'Project berhasil dihapus',
    };
  }
}
