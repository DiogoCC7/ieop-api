import { FastifyInstance } from "fastify";
import jasminApi from "../services/jasmin-api";

export default async function usersRoutes(app: FastifyInstance, opts) {
    app.get("/users", async (request, reply) => {
        const { data, status } = await jasminApi.get<User[]>("/salesCore/customerParties");

        if (status !== 200) {
            throw new Error("Error fetching users");
        }

        const filterData = data.filter((value) => value.mobile !== null);

        return filterData.map((value) => ({
            country: value.countryDescription,
            email: value.createdBy,
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