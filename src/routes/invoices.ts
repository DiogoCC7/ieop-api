import { FastifyInstance } from "fastify";
import jasminApi from "../services/jasmin-api";

type InvoiceRequest = {
    customerId: string,
    products : [
        {
            productId: string,
            amount: number,
            quantity: number
        }
    ],
    discount: number
}

type InvoiceResponse = {
    invoiceId: string,
    discount: number,
    grossValue: {
        amount: number
    },
    taxTotal: {
        amount: number
    },
    allowanceChargeAmount: {
        amount: number
    }
}

export default async function name(app: FastifyInstance, opts) {
    function convertDate(date: Date) {
        date.setFullYear(2023);
        return date.toISOString().slice(0, 19).replace("T", " ");
    }

    app.post("/invoices", async (request, reply) => {
        const req = request.body as InvoiceRequest;

        const documentDate = new Date();
        const postingDate = new Date();
        postingDate.setDate(documentDate.getDate() + 30);

        const totalAmount = req.products.reduce((prev, current) => prev + current.amount * current.quantity, 0);
        const discountPercent = req.discount * 100 / totalAmount;

        const { status, data } = await jasminApi.post("/billing/invoices", {
            buyercustomerparty: req.customerId,
            serie: 2023,
            discount: discountPercent,
            documentDate: "2023-12-17 00:16:44",
            postingDate: "2023-12-26 00:16:44",
            documentLines: req.products.map(product => ({
                salesItem: product.productId,
                quantity: product.quantity,
                unitPrice: {
                    amount: product.amount
                }
            }))
        } as CreateInvoiceRequest);

        if (status !== 201) {
            throw new Error("Error creating an invoice");
        }

        return {
            invoiceId: data
        };
    });

    app.get("/invoices", async (request, _reply) => {
        const { invoiceId } = request.query as { invoiceId: string };
        const { data: invoiceData, status: statusInvoice } = await jasminApi.get<InvoiceResponse>(`/billing/invoices/${invoiceId}`);

        if (statusInvoice !== 200) {
            throw new Error("Error creating an invoice");
        }

        return {
            invoiceId: invoiceData.invoiceId,
            discount: invoiceData.discount,
            discountValue: invoiceData.allowanceChargeAmount.amount,
            totalAmount: invoiceData.grossValue.amount + invoiceData.taxTotal.amount,
            taxValue: invoiceData.taxTotal.amount
        } as CreateInvoiceResponse;
    });
}