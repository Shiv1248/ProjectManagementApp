import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const projectId = event?.pathParameters?.id;

        if (!projectId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Project ID is required" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        const project = await prisma.project.findUnique({
            where: {
                id: Number(projectId),
            },
            include: {
                users: true,
                tasks: true
            }
        });

        if (!project) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Project not found" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(project, (key, value) => {
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
            body: JSON.stringify({ error: "Failed to get project" }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } finally {
        await prisma.$disconnect();
    }
};
