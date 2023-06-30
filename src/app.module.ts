import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { RolesModule } from "./roles/roles.module";
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService) => ({
        type: "postgres",
        host: config.get("HOST") || "localhost",
        port: Number(config.get("PORT")) || 5432,
        username: config.get("DB_USERNAME"),
        password: config.get("PASSWORD"),
        database:
          config.get("NODE_ENV") === "test"
            ? config.get("TEST_DB")
            : config.get("DATABASE"),
        autoLoadEntities: true,
        synchronize: config.get("NODE_ENV") !== "production",
      }),
      inject: [ConfigService],
    }),
    RolesModule,
  ],
})
export class AppModule {
  constructor(dataSource: DataSource) {
    if (dataSource.isInitialized)
      console.log("Connected to DB:", dataSource.options.database);
  }
}
