import { FastifyInstance } from "fastify";
import jasminApi from "../services/jasmin-api";

const Categories = ["Adventure", "Fight", "Racing", "RPG", "Shooter", "Simulation", "Sports", "Strategy"];

function getHighestPrice(priceListLines: PriceParams[]) {
    if (priceListLines.length <= 0) {
        return {
            amount: 0,
            symbol: "€"
        };
    }

    const price = priceListLines.reduce(
        (prev, current) =>
            prev.priceAmount.amount > current.priceAmount.amount ? prev : current
    );

    return price.priceAmount;
}


export default async function productRoutes(app: FastifyInstance, opts) {
    app.get("/products", async (_request, _reply) => {
        const { data, status } = await jasminApi.get<Product[]>("/salesCore/salesitems");

        if (status !== 200) {
            throw new Error("Error fetching products");
        }

        const filterData = data.filter((value) => value.barcode !== null);

        return filterData.map((value) => {
            const highestPrice = getHighestPrice(value.priceListLines);
            
            return {
                bar_code: value.barcode,
                brand: value.brand,
                category: Categories[Math.floor(Math.random() * Categories.length)],
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