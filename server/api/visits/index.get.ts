import { Visit } from "../../models/Visit";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const page = parseInt(query.page as string) || 1;
    const limit = parseInt(query.limit as string) || 10;
    const status = query.status as string;
    const search = (query.search as string) || "";

    const filter: any = {};
    if (status) filter.status = status;
    if (search) {
      filter.$or = [
        { "visitor.name": { $regex: search, $options: "i" } },
        { "visitor.identification": { $regex: search, $options: "i" } },
      ];
    }

    const [visits, total] = await Promise.all([
      Visit.find(filter)
        .populate("resident", "name apartment")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ entryTime: -1 })
        .lean(),
      Visit.countDocuments(filter),
    ]);

    return {
      visits,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error al obtener visitas:", error);
    throw createError({
      statusCode: 500,
      message: "Error al obtener visitas",
    });
  }
});
