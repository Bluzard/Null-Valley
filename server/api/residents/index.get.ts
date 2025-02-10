import { Resident } from "../../models/Resident";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const search = (query.search as string) || "";

    const filter = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { apartment: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const [residents, total] = await Promise.all([
      Resident.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ createdAt: -1 })
        .lean(),
      Resident.countDocuments(filter),
    ]);

    return {
      residents,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error al obtener residentes:", error);
    throw createError({
      statusCode: 500,
      message: "Error al obtener residentes",
    });
  }
});
