import { z } from 'zod'

export const appIpcSchema = {
  version: {
    args: z.tuple([]),
    return: z.string(),
  },
  'settings-get': {
    args: z.tuple([]),
    return: z.object({
      gameExecutablePath: z.string(),
      gameServerUrl: z.string(),
      chatServerUrl: z.string(),
    }),
  },
  'settings-save': {
    args: z.tuple([
      z.object({
        gameExecutablePath: z.string(),
        gameServerUrl: z.string(),
        chatServerUrl: z.string(),
      }),
    ]),
    return: z.void(),
  },
  'launch-game': {
    args: z.tuple([]),
    return: z.void(),
  },
}
