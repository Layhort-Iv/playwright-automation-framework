import * as path from 'path';
import * as fs from 'fs';
import * as dotenv from 'dotenv';
import { EnvConfig, EnvSchema } from './env.schema';

/**
 * Singleton Configuration Service that handles:
 * - Dynamic environment resolution (.env.<TEST_ENV>)
 * - Fail-fast Zod validation
 * - Immutable access to typed configuration parameters
 */
export class ConfigService {
  private static instance: ConfigService;
  private readonly config: EnvConfig;

  private constructor() {
    this.config = this.loadAndValidateConfig();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  public getConfig(): EnvConfig {
    return this.config;
  }

  private loadAndValidateConfig(): EnvConfig {
    const activeEnv = (process.env.TEST_ENV || 'local').toLowerCase();

    // Candidate configuration paths to resolve
    const envFileCandidates = [
      path.resolve(process.cwd(), `configs/.env.${activeEnv}`),
      path.resolve(process.cwd(), `.env.${activeEnv}`),
      path.resolve(process.cwd(), 'configs/.env.local'),
      path.resolve(process.cwd(), '.env'),
    ];

    let loadedFile = '';
    for (const envPath of envFileCandidates) {
      if (fs.existsSync(envPath)) {
        dotenv.config({ path: envPath, override: false });
        loadedFile = envPath;
        break;
      }
    }

    // Attempt Zod parsing against merged environment
    const parseResult = EnvSchema.safeParse(process.env);

    if (!parseResult.success) {
      const errorFormatted = parseResult.error.format();
      throw new Error(
        `[ConfigService] Configuration validation failed for environment "${activeEnv}" (Loaded from: ${
          loadedFile || 'process.env only'
        }):\n${JSON.stringify(errorFormatted, null, 2)}`,
      );
    }

    return parseResult.data;
  }
}

export const configService = ConfigService.getInstance();
export const config = configService.getConfig();
