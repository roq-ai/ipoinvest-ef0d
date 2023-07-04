import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { gmpValidationSchema } from 'validationSchema/gmps';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.gmp
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getGmpById();
    case 'PUT':
      return updateGmpById();
    case 'DELETE':
      return deleteGmpById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getGmpById() {
    const data = await prisma.gmp.findFirst(convertQueryToPrismaUtil(req.query, 'gmp'));
    return res.status(200).json(data);
  }

  async function updateGmpById() {
    await gmpValidationSchema.validate(req.body);
    const data = await prisma.gmp.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteGmpById() {
    const data = await prisma.gmp.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
