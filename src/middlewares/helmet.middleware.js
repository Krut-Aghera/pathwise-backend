import helmet from "helmet";

const isProduction = process.env.NODE_ENV === "production";

const helmetMiddleware = helmet({
    hidePoweredBy: true,
    noSniff: true,

    frameguard: {
        action: "deny",
    },

    xssFilter: false,

    permittedCrossDomainPolicies: {
        permittedPolicies: "none",
    },

    dnsPrefetchControl: {
        allow: false,
    },

    hsts: isProduction
        ? {
              maxAge: 31536000,
              includeSubDomains: true,
              preload: true,
          }
        : false,

    ieNoOpen: true,

    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: {
        policy: "cross-origin",
    },

    crossOriginOpenerPolicy: {
        policy: "same-origin",
    },

    originAgentCluster: true,

    referrerPolicy: {
        policy: "strict-origin-when-cross-origin",
    },

    contentSecurityPolicy: false,
});

export default helmetMiddleware;
