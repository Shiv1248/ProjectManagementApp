import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const userId = event?.pathParameters?.id;

        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "User ID is required" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        const user = await prisma.user.findUnique({
            where: {
                id: Number(userId),
            },
            include: {
                tasks: true,
                projects: true
            }
        });

        if (!user) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "User not found" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(user, (key, value) => {
                return typeof value === 'bigint'
                    ? value.toString()
                    : value;
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to get user" }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } finally {
        await prisma.$disconnect();
    }
};
