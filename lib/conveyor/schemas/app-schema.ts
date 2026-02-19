import { z } from 'zod'

export const appIpcSchema = {
  version: {
    args: z.tuple([]),
    return: z.string(),
  },
  'keycloak-status': {
    args: z.tuple([z.string()]),
    return: z.object({
      ok: z.boolean(),
      registrationEndpoint: z.string().nullable(),
    }),
  },
  'log-debug': {
    args: z.tuple([
      z.object({
        level: z.enum(['debug', 'info', 'warn', 'error']),
        message: z.string(),
        data: z.unknown().optional(),
      }),
    ]),
    return: z.void(),
  },
  'settings-get': {
    args: z.tuple([]),
    return: z.object({
      gameExecutablePath: z.string(),
      gameServerUrl: z.string(),
      chatServerUrl: z.string(),
      keycloakUrl: z.string(),
      logFileName: z.string(),
    }),
  },
  'settings-save': {
    args: z.tuple([
      z.object({
        gameExecutablePath: z.string(),
        gameServerUrl: z.string(),
        chatServerUrl: z.string(),
        keycloakUrl: z.string(),
        logFileName: z.string(),
      }),
    ]),
    return: z.void(),
  },
  login: {
    args: z.tuple([
      z.object({
        baseUrl: z.string(),
        username: z.string(),
        password: z.string(),
      }),
    ]),
    return: z.object({
      success: z.boolean(),
      token: z.any().nullable(),
      error: z.string().nullable(),
    }),
  },
  register: {
    args: z.tuple([
      z.object({
        registrationEndpoint: z.string(),
        username: z.string(),
        email: z.string(),
        password: z.string(),
      }),
    ]),
    return: z.object({
      success: z.boolean(),
      error: z.string().nullable(),
    }),
  },
  'launch-game': {
    args: z.tuple([]),
    return: z.void(),
  },
}
