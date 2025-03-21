import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const userId = event?.pathParameters?.id;
        const data = JSON.parse(event?.body || '{}');

        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "User ID is required" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: Number(userId),
            },
            data: data,
        });

        return {
            statusCode: 200,
            body: JSON.stringify(updatedUser),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to update user" }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } finally {
        await prisma.$disconnect();
    }
};
