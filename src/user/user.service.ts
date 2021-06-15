import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRespository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    return await this.userRespository.save(createUserDto);
  }

  async findAll() {
    const users = await this.userRespository.find();

    return users;
  }

  async findOne(id: string) {
    const user = await this.userRespository.findOne(id, {
      relations: ['friends', 'friendOf'],
    });
    if (typeof user === 'undefined') {
      throw new NotFoundException();
    }
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: string) {
    return `This action removes a #${id} user`;
  }

  async addFriend(userId: string, friendId: string) {
    const user = await this.userRespository.findOne(userId, {
      relations: ['friends'],
    });
    if (typeof user === 'undefined') {
      throw new NotFoundException();
    }
    // check if new friend exists
    const friend = await this.userRespository.findOne(friendId);
    if (typeof friend === 'undefined') {
      throw new BadRequestException('No such friend to add');
    }
    user.friends.push(friend);

    console.log(user.friends);
    return this.userRespository.save(user);
  }
}
