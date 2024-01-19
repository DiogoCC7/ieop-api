import { FastifyInstance } from "fastify";
import jasminApi from "../services/jasmin-api";

const Categories = ["Adventure", "Fight", "Racing", "RPG", "Shooter", "Simulation", "Sports", "Strategy"];

type WarehouseProduct = {
    materialsItemWarehouses: [
        {
            stockBalance: number;
        }
    ];
};

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

    return price;
}


export default async function productRoutes(app: FastifyInstance, opts) {
    async function fetchProductWharehouse(id: string) {
        const { data: warehouseProducts, status: warehouseProductsStatus } = await jasminApi.get<WarehouseProduct>(`/materialscore/materialsitems/${id}`);

        if (warehouseProductsStatus !== 200) {
            throw new Error("Error fetching warehouse products");
        }

        return warehouseProducts;
    }

    app.get("/products", async (_request, _reply) => {
        const { data: products, status: productsStatus } = await jasminApi.get<Product[]>("/salesCore/salesitems");

        if (productsStatus !== 200) {
            throw new Error("Error fetching products");
        }

        const filterData = products.filter((value) => value.barcode !== null);

        return filterData.map(async (value) => {
            const highestPrice = getHighestPrice(value.priceListLines) as PriceParams;
            const extension = await fetchProductWharehouse(value.itemKey);        
            
            return {
                id: value.itemKey,
                bar_code: value.barcode,
                brand: value.brand,
                category: Categories[Math.floor(Math.random() * Categories.length)],
                description: value.complementaryDescription,
                edition: value.brandModel,
                family: value.assortment,
                image: value.image,
                name: value.itemKey,
                price: highestPrice.priceAmount.amount,
                price_unit: highestPrice.priceAmount.symbol,
                quantity: extension.materialsItemWarehouses[0].stockBalance,
            } as ProductResponse;
        });
    });
}