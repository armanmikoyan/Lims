import { Logger } from '@nestjs/common';
import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { IUser } from 'src/modules/user/interfaces/userEntity.interface';

const prisma = new PrismaClient();
const logger = new Logger(UserSeed.name);

export async function UserSeed() {
  const users: IUser[] = [
    { email: 'admin@elab.com', firstName: "Arman", lastName: "Mikoyan", password: 'Admin_123', role: Role.Admin },
    { email: 'nurai@elab.com',  firstName: "Noah", lastName: "Jones", password: 'Nurai_456', role: Role.Admin },
    {
      email: 'arman@elab.com',
      firstName: "Ava",
      lastName: "Davis",
      password: 'Arman_789',
      role: Role.ProcurementOfficer,
    },
    {
      email: 'bob@elab.com',
      firstName: "Isabella",
      lastName: "Wilson",
      password: 'Bob_123',
      role: Role.ProcurementOfficer,
    },
    { email: 'jane@elab.com', firstName: "Ethan", lastName: "Brown", password: 'Jane_432', role: Role.Researcher },
    { email: 'lena@elab.com', firstName: "Mia", lastName: "Jones", password: 'Lena_876', role: Role.Researcher },
    { email: 'mark@elab.com', firstName: "Oliver", lastName: "Thomas", password: 'Mark_739', role: Role.Researcher },
    { email: 'jack@elab.com', firstName: "Ethan", lastName: "Jones", password: 'Jack_720', role: Role.Researcher },
    { email: 'karya@elab.com',firstName: "Isabella", lastName: "firstName", password: 'Karya_007', role: Role.Researcher },
  ];

  for (const user of users) {
    const userData: IUser = {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      password: await bcrypt.hash(user.password, 10),
      role: user.role,
    };

    await prisma.user.upsert({
      where: { email: user.email },
      update: {},
      create: userData
    });
  }
  logger.log('User seed completed');
}
