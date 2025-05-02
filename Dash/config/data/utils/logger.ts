/**
 * Logger Utility
 * 
 * This utility provides logging functionality with different log levels.
 * It supports:
 * - Different log levels (debug, info, warn, error)
 * - Contextual logging with prefixes
 * - Formatting of objects and errors
 * - Timestamp inclusion
 */

/**
 * Log Level
 * Defines the severity of a log message
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Log Level Priority
 * Maps log levels to numeric priorities
 */
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

/**
 * Logger Configuration
 */
export interface LoggerConfig {
  /**
   * Minimum log level to display
   */
  level: LogLevel;
  
  /**
   * Context prefix for log messages
   */
  context?: string;
  
  /**
   * Whether to include timestamps in log messages
   */
  timestamps?: boolean;
  
  /**
   * Whether to log to console
   */
  console?: boolean;
  
  /**
   * Custom log handler
   */
  logHandler?: (level: LogLevel, message: string, ...args: any[]) => void;
}

/**
 * Logger
 * Provides logging functionality with different log levels
 */
export class Logger {
  private config: LoggerConfig;
  
  /**
   * Create a new Logger
   * 
   * @param levelOrConfig - Log level or configuration
   */
  constructor(levelOrConfig: LogLevel | LoggerConfig = 'info') {
    if (typeof levelOrConfig === 'string') {
      this.config = {
        level: levelOrConfig,
        timestamps: true,
        console: true
      };
    } else {
      this.config = {
        timestamps: true,
        console: true,
        ...levelOrConfig
      };
    }
  }
  
  /**
   * Log a debug message
   * 
   * @param message - Log message
   * @param args - Additional arguments
   */
  debug(message: string, ...args: any[]): void {
    this.log('debug', message, ...args);
  }
  
  /**
   * Log an info message
   * 
   * @param message - Log message
   * @param args - Additional arguments
   */
  info(message: string, ...args: any[]): void {
    this.log('info', message, ...args);
  }
  
  /**
   * Log a warning message
   * 
   * @param message - Log message
   * @param args - Additional arguments
   */
  warn(message: string, ...args: any[]): void {
    this.log('warn', message, ...args);
  }
  
  /**
   * Log an error message
   * 
   * @param message - Log message
   * @param args - Additional arguments
   */
  error(message: string, ...args: any[]): void {
    this.log('error', message, ...args);
  }
  
  /**
   * Log a message with a specific level
   * 
   * @param level - Log level
   * @param message - Log message
   * @param args - Additional arguments
   */
  log(level: LogLevel, message: string, ...args: any[]): void {
    // Check if the log level is high enough
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.config.level]) {
      return;
    }
    
    // Format the message
    let formattedMessage = message;
    
    // Add timestamp if enabled
    if (this.config.timestamps) {
      const timestamp = new Date().toISOString();
      formattedMessage = `[${timestamp}] ${formattedMessage}`;
    }
    
    // Add context if provided
    if (this.config.context) {
      formattedMessage = `[${this.config.context}] ${formattedMessage}`;
    }
    
    // Add log level
    formattedMessage = `[${level.toUpperCase()}] ${formattedMessage}`;
    
    // Use custom log handler if provided
    if (this.config.logHandler) {
      this.config.logHandler(level, formattedMessage, ...args);
      return;
    }
    
    // Log to console if enabled
    if (this.config.console) {
      switch (level) {
        case 'debug':
          console.debug(formattedMessage, ...args);
          break;
        case 'info':
          console.info(formattedMessage, ...args);
          break;
        case 'warn':
          console.warn(formattedMessage, ...args);
          break;
        case 'error':
          console.error(formattedMessage, ...args);
          break;
      }
    }
  }
  
  /**
   * Create a child logger with a specific context
   * 
   * @param context - Context for the child logger
   * @returns Child logger
   */
  createChild(context: string): Logger {
    return new Logger({
      ...this.config,
      context: this.config.context
        ? `${this.config.context}:${context}`
        : context
    });
  }
  
  /**
   * Set the log level
   * 
   * @param level - New log level
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }
}

/**
 * Global logger instance
 */
export const globalLogger = new Logger();