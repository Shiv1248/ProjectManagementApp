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

        const task = await prisma.task.findUnique({
            where: {
                id: Number(taskId),
            },
            include: {
                user: true,
                project: true
            }
        });

        if (!task) {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: "Task not found" }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

        return {
            statusCode: 200,
            body: JSON.stringify(task, (key, value) => {
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
            body: JSON.stringify({ error: "Failed to get task" }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } finally {
        await prisma.$disconnect();
    }
};
