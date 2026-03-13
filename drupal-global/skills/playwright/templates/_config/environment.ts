/**
 * @file
 * Configuración de entorno para los tests de Playwright.
 *
 * Este archivo define la clase `Environment` que proporciona una forma centralizada
 * de gestionar las configuraciones de entorno para los tests.
 *
 * La clase `Environment` contiene un método estático `getConfig()` que devuelve
 * la configuración correspondiente al entorno especificado en la variable de
 * entorno `ENVIRONMENT`.
 *
 * Si no se especifica ningún entorno, se utiliza la configuración por defecto.
 */

interface EnvConfig {
    baseURL: string;
    users: {
        manager: { name: string; pass: string };
        user: { name: string; pass: string };
    };
}

// Valores comunes a todos los entornos: se definen una sola vez.
const SHARED = {
    paths: {
        login: '/user/login',
        logout: '/user/logout',
    },
};

export class Environment {
    private static configs: Record<string, EnvConfig> = {
        DEV: {
            baseURL: "https://dev.example.com",
            users: {
                manager: { name: 'manager', pass: '******' },
                user: { name: 'user', pass: '******' },
            }
        },

        STG: {
            baseURL: "https://stg.example.com",
            users: {
                manager: { name: 'manager', pass: '******' },
                user: { name: 'user', pass: '******' },
            }
        },

        PRO: {
            baseURL: "https://prod.example.com",
            users: {
                manager: { name: 'manager', pass: '******' },
                user: { name: 'user', pass: '******' },
            }
        },
    };

    static getConfig(): EnvConfig & typeof SHARED {
        const env = process.env.ENVIRONMENT || "DEV";
        const specific = Environment.configs[env] ?? Environment.configs.DEFAULT;
        return { ...SHARED, ...specific };
    }
}
