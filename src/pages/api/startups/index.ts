import type { NextApiRequest, NextApiResponse } from 'next';
import { roqClient } from 'server/roq';
import { prisma } from 'server/db';
import { authorizationValidationMiddleware, errorHandlerMiddleware } from 'server/middlewares';
import { startupValidationSchema } from 'validationSchema/startups';
import { convertQueryToPrismaUtil } from 'server/utils';
import { getServerSession } from '@roq/nextjs';

async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { roqUserId, user } = await getServerSession(req);
  switch (req.method) {
    case 'GET':
      return getStartups();
    case 'POST':
      return createStartup();
    default:
      return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  async function getStartups() {
    const data = await prisma.startup
      .withAuthorization({
        roqUserId,
        tenantId: user.tenantId,
        roles: user.roles,
      })
      .findMany(convertQueryToPrismaUtil(req.query, 'startup'));
    return res.status(200).json(data);
  }

  async function createStartup() {
    await startupValidationSchema.validate(req.body);
    const body = { ...req.body };
    if (body?.game_player?.length > 0) {
      const create_game_player = body.game_player;
      body.game_player = {
        create: create_game_player,
      };
    } else {
      delete body.game_player;
    }
    if (body?.gmp?.length > 0) {
      const create_gmp = body.gmp;
      body.gmp = {
        create: create_gmp,
      };
    } else {
      delete body.gmp;
    }
    const data = await prisma.startup.create({
      data: body,
    });
    return res.status(200).json(data);
  }
}

export default function apiHandler(req: NextApiRequest, res: NextApiResponse) {
  return errorHandlerMiddleware(authorizationValidationMiddleware(handler))(req, res);
}
