class Logger {
  private static instance: Logger

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger()
    }
    return Logger.instance
  }

  public log(message: string): void {
    const stack = new Error().stack
    if (stack) {
      const callerLine = stack.split('\n')[2]
      console.log(`[${callerLine}] ${message}`)
    }
  }

  public warn(message: String): void {
    const stack = new Error().stack
    if (stack) {
      const callerLine = stack.split('\n')[2]
      console.warn(`[${callerLine}] ${message}`)
    }
  }

  public error(message: String | unknown): void {
    const stack = new Error().stack
    if (stack) {
      const callerLine = stack.split('\n')[2]
      console.error(`[${callerLine}] ${message}`)
    }
  }
}

export default Logger
