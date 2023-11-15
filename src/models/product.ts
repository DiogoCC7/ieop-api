interface Product {
    barcode: string;
    brand: string;
    complementaryDescription: string;
    brandModel: string;
    assortment: string;
    image: string;
    itemKey: string;
    priceListLines: [
        priceAmount: {
            amount: number;
            symbol: string;
        }
    ];
}