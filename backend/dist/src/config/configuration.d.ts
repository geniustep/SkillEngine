declare const _default: () => {
    nodeEnv: string;
    port: number;
    apiVersion: string;
    appName: string;
    appUrl: string;
    database: {
        url: string | undefined;
        poolMin: number;
        poolMax: number;
    };
    redis: {
        host: string;
        port: number;
        password: string | undefined;
        db: number;
        ttl: number;
    };
    keycloak: {
        url: string | undefined;
        realm: string;
        clientId: string;
        clientSecret: string | undefined;
        adminClientId: string;
        adminClientSecret: string | undefined;
    };
    jwt: {
        secret: string;
        expiresIn: string;
        refreshSecret: string;
        refreshExpiresIn: string;
    };
    storage: {
        provider: string;
        region: string;
        accessKeyId: string | undefined;
        secretAccessKey: string | undefined;
        bucket: string;
        endpoint: string | undefined;
        cdnUrl: string | undefined;
        forcePathStyle: boolean;
    };
    daily: {
        apiKey: string | undefined;
        domain: string | undefined;
        apiUrl: string;
    };
    bbb: {
        url: string | undefined;
        secret: string | undefined;
    };
    pusher: {
        appId: string | undefined;
        key: string | undefined;
        secret: string | undefined;
        cluster: string;
    };
    email: {
        provider: string;
        sendgridApiKey: string | undefined;
        from: string;
        fromName: string;
    };
    throttle: {
        ttl: number;
        limit: number;
        authTtl: number;
        authLimit: number;
    };
    cors: {
        origins: string[];
    };
    upload: {
        maxImageSize: number;
        maxVideoSize: number;
        maxDocumentSize: number;
        allowedImageTypes: string[];
        allowedVideoTypes: string[];
        allowedDocumentTypes: string[];
    };
    pagination: {
        defaultPageSize: number;
        maxPageSize: number;
    };
    logging: {
        level: string;
        format: string;
    };
    sentry: {
        dsn: string | undefined;
    };
};
export default _default;
