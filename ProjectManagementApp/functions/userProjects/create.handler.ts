import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const data = JSON.parse(event?.body || '{}');
        const { userId, projectId } = data;

        if (!userId || !projectId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "User ID and Project ID are required" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        const userProject = await prisma.userProject.create({
            data: {
                userId: userId,
                projectId: projectId,
            },
        });

        return {
            statusCode: 201,
            body: JSON.stringify(userProject),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to assign user to project" }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } finally {
        await prisma.$disconnect();
    }
};
