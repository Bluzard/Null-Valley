import { Facility } from "../../models/Facility";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validación básica
    if (!body.name) {
      throw createError({
        statusCode: 400,
        message: "El nombre es requerido",
      });
    }

    const facility = new Facility(body);
    await facility.save();

    return facility;
  } catch (error) {
    console.error("Error al crear instalación:", error);
    if (error instanceof Error) {
      throw createError({
        statusCode: (error as any).statusCode || 500,
        message: error.message || "Error al crear instalación",
      });
    } else {
      throw createError({
        statusCode: 500,
        message: "Error al crear instalación",
      });
    }
  }
});
