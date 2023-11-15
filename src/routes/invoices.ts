import { FastifyInstance } from "fastify";
import jasminApi from "../services/jasmin-api";

export default async function name(app: FastifyInstance, opts) {
    app.post("/invoices", async (request, reply) => {
        let response;
        
        try {
            response = await jasminApi.post("/billing/invoices", request.body as CreateInvoiceRequest);

            if (response.status !== 201) {
                throw new Error("Error creating an invoice");
            }

        } catch (error) {
            console.log(error);
            
            throw new Error("Error creating an invoice");
        }

        return {
            invoiceId: response.data
        } as CreateInvoiceResponse;
    });

    app.get("/invoices/:invoiceId", async (request, reply) => {
        const { invoiceId } = request.params as GetInvoiceRequest;

        const response = await jasminApi.get(`/billing/invoices/${invoiceId}`);

        if (response.status !== 200) {
            throw new Error("Error creating an invoice");
        }

        return {
            invoiceId: response.data
        } as CreateInvoiceResponse;
    });
}