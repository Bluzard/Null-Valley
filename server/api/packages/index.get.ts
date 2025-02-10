import { Package } from "../../models/Package";

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
        { deliveryCompany: { $regex: search, $options: "i" } },
        { trackingNumber: { $regex: search, $options: "i" } },
      ];
    }

    const [packages, total] = await Promise.all([
      Package.find(filter)
        .populate("recipient", "name apartment")
        .skip((page - 1) * limit)
        .limit(limit)
        .sort({ receivedAt: -1 })
        .lean(),
      Package.countDocuments(filter),
    ]);

    return {
      packages,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error("Error al obtener encomiendas:", error);
    throw createError({
      statusCode: 500,
      message: "Error al obtener encomiendas",
    });
  }
});
