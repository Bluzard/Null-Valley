import { Resident } from "../../models/Resident";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validación básica
    if (!body.name || !body.apartment || !body.email) {
      throw createError({
        statusCode: 400,
        message: "Faltan campos requeridos",
      });
    }

    const resident = new Resident(body);
    await resident.save();

    return resident;
  } catch (error) {
    console.error("Error al crear residente:", error);
    if (error instanceof Error) {
      throw createError({
        statusCode: (error as any).statusCode || 500,
        message: error.message || "Error al crear residente",
      });
    } else {
      throw createError({
        statusCode: 500,
        message: "Error al crear residente",
      });
    }
  }
});
