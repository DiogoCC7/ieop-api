interface CreateInvoiceRequest {
    buyercustomerparty: string;
    documentLines: [{
        salesItem: string;
        unitPrice: {
            amount: number;
        };
    }];
};