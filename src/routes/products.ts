import { FastifyInstance } from "fastify";
import jasminApi from "../services/jasmin-api";

function getHighestPrice(priceListLines: [{ amount: number; symbol: string }]) {
    if (priceListLines.length <= 0) {
        return {
            amount: 0,
            symbol: "€"
        };
    }

    return priceListLines.reduce(
        (prev, current) =>
            prev.amount > current.amount ? prev : current
    );
}


export default async function productRoutes(app: FastifyInstance, opts) {
    app.get("/products", async (request, reply) => {
        const response = await jasminApi.get("/salesCore/salesitems");

        if (response.status !== 200) {
            throw new Error("Error fetching products");
        }

        return (response.data as [Product]).map((value) => {
            const highestPrice = getHighestPrice(value.priceListLines);

            return {
                bar_code: value.barcode,
                brand: value.brand,
                category: 'not defined',
                description: value.complementaryDescription,
                edition: value.brandModel,
                family: value.assortment,
                image: value.image,
                name: value.itemKey,
                price: highestPrice.amount,
                price_unit: highestPrice.symbol,
                quantity: value.priceListLines.length
            } as ProductResponse;
        });
    });
}