import { FastifyInstance } from "fastify";
import jasminApi from "../services/jasmin-api";

export default async function usersRoutes(app: FastifyInstance, opts) {
    app.post("/users", async (request, _reply) => {
        const req = request.body as Omit<UserResponse, "id">;
        
        const { status: createdStatus } = await jasminApi.post("/salesCore/customerParties", {
            address: req.n_port,
            cityName: req.locality,
            companyTaxID: req.nif,
            countryDescription: req.country,
            electronicMail: req.email,
            mobile: req.phone,
            name: req.name,
            postalZone: req.postal_code,
            streetName: req.street
        } as User);

        if (createdStatus !== 201) {
            throw new Error("Error fetching users");
        }
    
        const { data, status } = await jasminApi.get<User[]>("/salesCore/customerParties");
        
        if (status !== 200) {
            throw new Error("Error fetching users");
        }

        const filterData = data.filter((value) => value.electronicMail === req.email);

        return filterData.map((value) => ({
            id: value.partyKey,
            country: value.countryDescription,
            email: value.electronicMail,
            locality: value.cityName,
            n_port: value.address,
            name: value.name,
            nif: value.companyTaxID,
            phone: value.mobile,
            postal_code: value.postalZone,
            street: value.streetName
        } as UserResponse));
    });

    app.get("/users", async (_request, _reply) => {
        const { data, status } = await jasminApi.get<User[]>("/salesCore/customerParties");

        if (status !== 200) {
            throw new Error("Error fetching users");
        }

        const filterData = data.filter((value) => value.mobile !== null);

        return filterData.map((value) => ({
            id: value.partyKey,
            country: value.countryDescription,
            email: value.electronicMail,
            locality: value.cityName,
            n_port: value.address,
            name: value.name,
            nif: value.companyTaxID,
            phone: value.mobile,
            postal_code: value.postalZone,
            street: value.streetName
        } as UserResponse));
    });
}