const knex = {

    development: {
        client: "pg",
        connection: {
            host: "127.0.0.1",
            database: "phone_provisioner",
            user: "postgres",
            password: "postgres"
        },
        migrations: {
            tableName: "migrations"
        }
    },

    test: {
        client: "pg",
        connection: {
            host: process.env.PG_CONNECTION_HOST,
            database: "phone_provisioner",
            user: process.env.PG_CONNECTION_USER
        },
        migrations: {
            tableName: "migrations"
        }
    },

    staging: {
        client: "pg",
        connection: {
            database: "phone_provisioner",
            user: "postgres",
            password: "postgres"
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "migrations"
        }
    },

    production: {
        client: "pg",
        connection: {
            database: "phone_provisioner",
            user: "postgres",
            password: "postgres"
        },
        pool: {
            min: 2,
            max: 10
        },
        migrations: {
            tableName: "migrations"
        }
    }

};

module.exports = knex;