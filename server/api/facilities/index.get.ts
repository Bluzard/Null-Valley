import { Facility } from "../../models/Facility";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const search = (query.search as string) || "";

    const filter = search
      ? {
          name: { $regex: search, $options: "i" },
        }
      : {};

    const [facilities, total] = await Promise.all([
      Facility.find(filter)
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ name: 1 })
        .lean(),
      Facility.countDocuments(filter),
    ]);

    return {
      facilities,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error al obtener instalaciones:", error);
    throw createError({
      statusCode: 500,
      message: "Error al obtener instalaciones",
    });
  }
});
