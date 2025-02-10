import { Visit } from "../../models/Visit";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validación básica
    if (
      !body.visitor?.name ||
      !body.visitor?.identification ||
      !body.resident
    ) {
      throw createError({
        statusCode: 400,
        message: "Faltan campos requeridos",
      });
    }

    const visit = new Visit({
      ...body,
      entryTime: new Date(),
      status: "in-progress",
    });

    await visit.save();
    return visit;
  } catch (error) {
    console.error("Error al crear visita:", error);
    if (error instanceof Error) {
      throw createError({
        statusCode: (error as any).statusCode || 500,
        message: error.message || "Error al crear visita",
      });
    } else {
      throw createError({
        statusCode: 500,
        message: "Error al crear visita",
      });
    }
  }
});
