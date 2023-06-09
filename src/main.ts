import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";
import { swaggerConfig, swaggerOptions } from "./swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    operationIdFactory: (_, methodKey: string) => methodKey,
  });
  SwaggerModule.setup("doc", app, document, swaggerOptions);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(3000, "0.0.0.0");
  console.log(`Application is running on: ${await app.getUrl()}/doc`);
}
bootstrap();
