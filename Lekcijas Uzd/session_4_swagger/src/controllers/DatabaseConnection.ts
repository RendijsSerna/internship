import { DataSource } from "typeorm";
import { OrmSession } from "../models/orm/OrmSession";
import { OrmUsers } from "../models/orm/OrmUsers";

export class DatabaseConnection {
private static _instance: DatabaseConnection;
dataSource: DataSource;

private constructor() {
    this.dataSource = new DataSource({
    type: "sqlite",
        database: "./identifier.sqlite",
        entities: [OrmUsers, OrmSession],
        logging: false,
        synchronize: false,
});
}

public static get instance(): DatabaseConnection {
if (!DatabaseConnection._instance) {
    DatabaseConnection._instance = new DatabaseConnection();
}
return DatabaseConnection._instance;
}

public async connect(): Promise<void> {
    await this.dataSource.initialize();
}
}