import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  private users: User[] = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
  ];

  findAll(): User[] {
    return this.users;
  }

  findOne(id: number): User | undefined {
    return this.users.find((user) => user.id === id);
  }
}
// import {
//   Injectable,
//   InternalServerErrorException,
//   BadRequestException,
// } from '@nestjs/common';

// import { CreateUserDto } from './dto/create-user.dto';
// import { UpdateUserDto } from './dto/update-user.dto';
// import { PrismaService } from '../prisma/prisma.service';
// import { User } from 'generated/prisma';

// @Injectable()
// export class UsersService {
//   constructor(private prisma: PrismaService) {}

//   async create(createUserDto: CreateUserDto): Promise<User> {
//     const { name, email, password } = createUserDto;

//     try {
//       const user = await this.prisma.user.create({
//         data: {
//           name,
//           email,
//           password,
//         },
//       });
//       return user;
//     } catch (error: unknown) {
//       if (error instanceof Error) {
//         throw new InternalServerErrorException(error.message);
//       }
//       throw new InternalServerErrorException('Unexpected error occurred');
//     }
//   }

//   findAll() {
//     return `This action returns all users`;
//   }

//   findOne(id: number) {
//     return `This action returns a #${id} user`;
//   }

//   update(id: number, updateUserDto: UpdateUserDto) {
//     return `This action updates a #${id} user`;
//   }

//   remove(id: number) {
//     return `This action removes a #${id} user`;
//   }
// }
