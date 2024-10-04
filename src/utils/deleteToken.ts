// import { Injectable } from '@nestjs/common';
// import { PrismaService } from '../prisma/prisma.service';

// @Injectable()
// export class TokenService {
//   constructor(private readonly prisma: PrismaService) {}

//   async deleteAccessToken(userId: number): Promise<void> {
//     await this.prisma.token.deleteMany({
//       where: {
//         userId: userId,
//         type: 'access',
//       },
//     });
//   }
// }
