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

        const deletedProject = await prisma.project.delete({
            where: {
                id: Number(projectId),
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(deletedProject),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to delete project" }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } finally {
        await prisma.$disconnect();
    }
};
