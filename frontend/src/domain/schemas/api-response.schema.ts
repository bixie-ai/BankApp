import { z } from 'zod'

export function createApiResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string(),
    timestamp: z.string().datetime(),
  })
}

export type ApiResponseDto<T> = {
  success: boolean
  data: T
  message: string
  timestamp: string
}
