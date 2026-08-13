/** Standard envelope for all API responses, wrapping the payload with metadata. */
export interface ApiResponse<T> {
  /** Indicates whether the request completed without errors. */
  success: boolean
  /** The response payload whose shape depends on the endpoint. */
  data: T
  /** Human-readable status or error message from the server. */
  message: string
  /** ISO 8601 timestamp of when the server generated this response. */
  timestamp: string
}
