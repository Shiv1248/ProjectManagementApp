import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const projectId = event?.pathParameters?.projectId;

        if (!projectId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Project ID is required" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        const users = await prisma.user.findMany({
            where: {
                projects: {
                    some: {
                        id: Number(projectId),
                    },
                },
            },
            include: {
                projects: true,
                tasks: true
            }
        });

        if (!users) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "No user found" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(users, (key, value) => {
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
            body: JSON.stringify({ error: "Failed to get users" }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } finally {
        await prisma.$disconnect();
    }
};
