import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const data = JSON.parse(event?.body || '{}');
        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: data.password,
                role: data.role ?? 'EMPLOYEE',
                image: data?.image
            },
        });

        return {
            statusCode: 201,
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to create user" }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } finally {
        await prisma.$disconnect();
    }
};
