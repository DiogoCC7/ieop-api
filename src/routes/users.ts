import { FastifyInstance } from "fastify";
import jasminApi from "../services/jasmin-api";

export default async function usersRoutes(app: FastifyInstance, opts) {
    app.get("/users", async (request, reply) => {
        const response = await jasminApi.get("/salesCore/customerParties");

        if (response.status !== 200) {
            throw new Error("Error fetching users");
        }

        return (response.data as [User]).map((value) => ({
            country: value.countryDescription,
            email: value.createdBy,
            locality: value.cityName,
            n_port: value.address,
            name: value.name,
            phone: value.mobile,
            postal_code: value.postalZone,
            street: value.streetName
        } as UserResponse));
    });
}