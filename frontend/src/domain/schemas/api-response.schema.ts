import { z } from 'zod'

/**
 * Creates a Zod schema for the standard API response envelope.
 * Wraps any domain-specific data schema with common metadata fields (success, message, timestamp).
 * Use this factory to validate responses from any endpoint that follows the shared envelope format.
 *
 * @param dataSchema - The Zod schema that validates the `data` payload specific to each endpoint.
 */
export function createApiResponseSchema<T extends z.ZodType>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string(),
    timestamp: z.string().datetime(),
  })
}

/** Generic API response envelope type used across all service calls. */
export type ApiResponseDto<T> = {
  success: boolean
  data: T
  message: string
  timestamp: string
}
