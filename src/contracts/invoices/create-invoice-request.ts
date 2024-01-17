interface CreateInvoiceRequest {
    buyercustomerparty: string;
    serie: number;
    documentDate: string;
    postingDate: string;
    documentLines: [{
        salesItem: string;
        unitPrice: {
            amount: number;
        };
    }];
};