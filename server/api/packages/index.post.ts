import { Package } from "../../models/Package";

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event);

    // Validación básica
    if (!body.recipient) {
      throw createError({
        statusCode: 400,
        message: "Falta especificar el destinatario",
      });
    }

    const newPackage = new Package({
      ...body,
      receivedAt: new Date(),
      status: "received",
    });

    await newPackage.save();
    return newPackage;
  } catch (error) {
    console.error("Error al crear encomienda:", error);
    if (error instanceof Error) {
      throw createError({
        statusCode: (error as any).statusCode || 500,
        message: error.message || "Error al crear encomienda",
      });
    } else {
      throw createError({
        statusCode: 500,
        message: "Error al crear encomienda",
      });
    }
  }
});
