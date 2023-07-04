const mapping: Record<string, string> = {
  'game-players': 'game_player',
  gmps: 'gmp',
  startups: 'startup',
  users: 'user',
};

export function convertRouteToEntityUtil(route: string) {
  return mapping[route] || route;
}
