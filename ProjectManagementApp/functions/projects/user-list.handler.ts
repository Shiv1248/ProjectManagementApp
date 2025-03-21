import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const userId = event?.pathParameters?.userId;

        if (!userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "User ID is required" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        const projects = await prisma.project.findMany({
            where: {
                users: {
                    some: {
                        id: Number(userId),
                    },
                },
            },
            include: {
                users: true,
                tasks: true
            }
        });

        if (!projects) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "No project found for this user" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(projects, (key, value) => {
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
            body: JSON.stringify({ error: "Failed to get projects" }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } finally {
        await prisma.$disconnect();
    }
};
