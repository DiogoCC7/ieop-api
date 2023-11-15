declare namespace NodeJS {
    interface ProcessEnv {
        SERVER_PORT: number;
        TENANT: string;
        ORGANIZATION: string;
        CLIENT_ID: string;
        CLIENT_SECRET: string;
    }
  }