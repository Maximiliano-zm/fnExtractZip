import fnExtractZip from "./services/fnExtractZip.js";
import { app } from "@azure/functions";

app.http("extracZip", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: async (request, context) => {
    try {
      const json = request.query.get("json") || (await request.json());

      const respuesta = await fnExtractZip(json);
      if (!respuesta) {
        return {
          status: 400,
          jsonBody: { error: "Error al EXTRAER ZIP o el ZIP está vacío" },
        };
      } else {
        return { status: 200, jsonBody: respuesta };
      }
    } catch (error) {
      console.error("Error al EXTRAER ZIP:", error);
      return { status: 500, jsonBody: { error: "Error interno del servidor" } };
    }
  },
});

export default app;
