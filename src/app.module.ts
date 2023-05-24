import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DataSource } from "typeorm";
import { Role } from "./entities/role.entities";
import { ConfigModule, ConfigService } from "@nestjs/config";

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
        entities: [Role],
        synchronize: true,
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {
  constructor(dataSource: DataSource) {
    if (dataSource.isInitialized) console.log("Connected to DB");
  }
}
