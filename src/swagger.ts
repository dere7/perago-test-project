import { DocumentBuilder } from "@nestjs/swagger";
import { SwaggerTheme } from "swagger-themes";

export const swaggerConfig = new DocumentBuilder()
  .setTitle("Perago Information Systems - Organizational Hierarchy")
  .setDescription(
    "Employee management API where you can create, update, delete, and read roles/employees",
  )
  .setVersion("1.0")
  .addTag("roles")
  .addTag("employees")
  .build();

const theme = new SwaggerTheme("v3");
export const swaggerOptions = {
  customSiteTitle: "Perago Information systems",
  customfavIcon: "http://peragosystems.com/favicon.ico",
  customCss: `
      ${theme.getBuffer("flattop")}
      .topbar-wrapper img { content: url('http://peragosystems.com/assets/images/perago-white.png'); width:150px; height:auto;}
      .swagger-ui .topbar { background-color: #55ba4a; }
    `,
};
