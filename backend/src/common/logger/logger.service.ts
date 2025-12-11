import { Injectable, LoggerService, Scope } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Log levels
 */
export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
  VERBOSE = 'verbose',
}

/**
 * Log entry structure
 */
export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  context?: string;
  message: string;
  data?: any;
  error?: {
    message: string;
    stack?: string;
    code?: string;
  };
  request?: {
    method: string;
    url: string;
    ip?: string;
    userId?: string;
    tenantId?: string;
  };
}

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements LoggerService {
  private context?: string;
  private isProduction: boolean;

  constructor(private configService: ConfigService) {
    this.isProduction = this.configService.get('NODE_ENV') === 'production';
  }

  setContext(context: string) {
    this.context = context;
  }

  log(message: any, context?: string) {
    this.writeLog(LogLevel.INFO, message, context);
  }

  error(message: any, trace?: string, context?: string) {
    this.writeLog(LogLevel.ERROR, message, context, { stack: trace });
  }

  warn(message: any, context?: string) {
    this.writeLog(LogLevel.WARN, message, context);
  }

  debug(message: any, context?: string) {
    if (!this.isProduction) {
      this.writeLog(LogLevel.DEBUG, message, context);
    }
  }

  verbose(message: any, context?: string) {
    if (!this.isProduction) {
      this.writeLog(LogLevel.VERBOSE, message, context);
    }
  }

  /**
   * Log with additional data
   */
  logWithData(level: LogLevel, message: string, data: any, context?: string) {
    this.writeLog(level, message, context, data);
  }

  /**
   * Log HTTP request
   */
  logRequest(
    method: string,
    url: string,
    statusCode: number,
    duration: number,
    ip?: string,
    userId?: string,
    tenantId?: string
  ) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: statusCode >= 400 ? LogLevel.ERROR : LogLevel.INFO,
      context: 'HTTP',
      message: `${method} ${url} ${statusCode} - ${duration}ms`,
      request: {
        method,
        url,
        ip,
        userId,
        tenantId,
      },
    };

    this.output(entry);
  }

  /**
   * Log database query
   */
  logQuery(query: string, params: any[], duration: number) {
    if (!this.isProduction) {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: LogLevel.DEBUG,
        context: 'Database',
        message: `Query executed in ${duration}ms`,
        data: {
          query: query.substring(0, 200),
          params: params?.slice(0, 5),
          duration,
        },
      };

      this.output(entry);
    }
  }

  /**
   * Log authentication event
   */
  logAuth(event: string, userId: string, success: boolean, ip?: string) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: success ? LogLevel.INFO : LogLevel.WARN,
      context: 'Auth',
      message: `${event} ${success ? 'successful' : 'failed'} for user ${userId}`,
      data: {
        event,
        userId,
        success,
        ip,
      },
    };

    this.output(entry);
  }

  private writeLog(level: LogLevel, message: any, context?: string, extra?: any) {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      context: context || this.context,
      message: typeof message === 'string' ? message : JSON.stringify(message),
      data: extra,
    };

    if (extra?.stack) {
      entry.error = {
        message: entry.message,
        stack: extra.stack,
      };
    }

    this.output(entry);
  }

  private output(entry: LogEntry) {
    if (this.isProduction) {
      // In production, output as JSON for log aggregation
      console.log(JSON.stringify(entry));
    } else {
      // In development, use colored output
      const colors: Record<LogLevel, string> = {
        [LogLevel.ERROR]: '\x1b[31m', // Red
        [LogLevel.WARN]: '\x1b[33m',  // Yellow
        [LogLevel.INFO]: '\x1b[32m',  // Green
        [LogLevel.DEBUG]: '\x1b[36m', // Cyan
        [LogLevel.VERBOSE]: '\x1b[37m', // White
      };
      const reset = '\x1b[0m';
      const color = colors[entry.level];

      const contextStr = entry.context ? `[${entry.context}]` : '';
      const dataStr = entry.data ? ` ${JSON.stringify(entry.data)}` : '';

      console.log(
        `${color}${entry.timestamp} ${entry.level.toUpperCase()} ${contextStr} ${entry.message}${dataStr}${reset}`
      );

      if (entry.error?.stack) {
        console.log(`${colors[LogLevel.ERROR]}${entry.error.stack}${reset}`);
      }
    }
  }
}
