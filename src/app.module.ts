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
        host: "localhost",
        port: 5432,
        username: config.get("dbUser"),
        password: config.get("dbPassword"),
        database: "orga_structure",
        autoLoadEntities: true,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
    RolesModule,
  ],
})
export class AppModule {
  constructor(dataSource: DataSource) {
    if (dataSource.isInitialized) console.log("Connected to DB");
  }
}
