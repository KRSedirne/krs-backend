import dotenv from 'dotenv';

// .env dosyasını yükle
dotenv.config();

const globalConfig = {

    // environment and port
    environment: process.env.NODE_ENV,
    port: process.env.PORT,

    // mongoDB
    mongoDev: process.env.DB_URI_DEV,
    mongoProd: process.env.DB_URI_PROD,

    // jwt secret key
    jwtSecret: process.env.JWT_SECRET,

    // SMTP
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        email: process.env.SMTP_EMAIL,
        password: process.env.SMTP_PASSWORD
    },

    // Frontend URL
    frontendUrl: process.env.FRONTEND_URL
}

export default globalConfig;

