import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const taskId = event?.pathParameters?.id;
        const data = JSON.parse(event?.body || '{}');

        if (!taskId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Task ID is required" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        const updatedTask = await prisma.task.update({
            where: {
                id: Number(taskId),
            },
            data: data,
        });

        return {
            statusCode: 200,
            body: JSON.stringify(updatedTask),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to update task" }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } finally {
        await prisma.$disconnect();
    }
};
