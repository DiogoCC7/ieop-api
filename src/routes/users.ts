import { FastifyInstance } from "fastify";
import jasminApi from "../services/jasmin-api";

export default async function usersRoutes(app: FastifyInstance, opts) {
    app.post("/users", async (request, reply) => {
      const req = request.body as UserResponse;

      const { status } = await jasminApi.post<UserResponse>("/salesCore/customerParties", {
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

      if (status !== 201) {
          throw new Error("Error fetching users");
      }

      return { message: "User created successfully" }
    });

    app.get("/users", async (request, reply) => {
        const { data, status } = await jasminApi.get<User[]>("/salesCore/customerParties");

        if (status !== 200) {
            throw new Error("Error fetching users");
        }

        const filterData = data.filter((value) => value.mobile !== null);

        return filterData.map((value) => ({
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