interface CreateInvoiceRequest {
    buyercustomerparty: string;
    serie: number;
    discount: number;
    documentDate: string;
    postingDate: string;
    documentLines: [{
        salesItem: string;
        quantity: number;
        unitPrice: {
            amount: number;
        };
    }]
};