import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const taskId = event?.pathParameters?.id;

        if (!taskId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "Task ID is required" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        const deletedTask = await prisma.task.delete({
            where: {
                id: Number(taskId),
            }
        });

        return {
            statusCode: 200,
            body: JSON.stringify(deletedTask),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to delete task" }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } finally {
        await prisma.$disconnect();
    }
};
