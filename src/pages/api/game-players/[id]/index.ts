import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { errorHandlerMiddleware } from 'server/middlewares';
import { gamePlayerValidationSchema } from 'validationSchema/game-players';
import { HttpMethod, convertMethodToOperation, convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  await prisma.game_player
    .withAuthorization({
      roqUserId,
      tenantId: user.tenantId,
      roles: user.roles,
    })
    .hasAccess(req.query.id as string, convertMethodToOperation(req.method as HttpMethod));

  switch (req.method) {
    case 'GET':
      return getGamePlayerById();
    case 'PUT':
      return updateGamePlayerById();
    case 'DELETE':
      return deleteGamePlayerById();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getGamePlayerById() {
    const data = await prisma.game_player.findFirst(convertQueryToPrismaUtil(req.query, 'game_player'));
    return res.status(200).json(data);
  }

  async function updateGamePlayerById() {
    await gamePlayerValidationSchema.validate(req.body);
    const data = await prisma.game_player.update({
      where: { id: req.query.id as string },
      data: {
        ...req.body,
      },
    });

    return res.status(200).json(data);
  }
  async function deleteGamePlayerById() {
    const data = await prisma.game_player.delete({
      where: { id: req.query.id as string },
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(handler)(req, res);
}
