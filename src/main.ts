import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const config = new DocumentBuilder()
    .setTitle("Perago Information Systems - Organizational Hierarchy")
    .setVersion("1.0")
    .addTag("PIS")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("doc", app, document, {
    customSiteTitle: "Perago Information systems",
    customfavIcon: "http://peragosystems.com/favicon.ico",
    customCss: `
      .topbar-wrapper img { content: url('http://peragosystems.com/assets/images/perago-white.png'); width:150px; height:auto;}
      .swagger-ui .topbar { background-color: #55ba4a; }
    `,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  await app.listen(3000, "0.0.0.0");
  console.log(`Application is running on: ${await app.getUrl()}/doc`);
}
bootstrap();
