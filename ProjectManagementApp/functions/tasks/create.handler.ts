import { PrismaClient } from "@prisma/client";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";

const prisma = new PrismaClient();

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
    try {
        const data = JSON.parse(event?.body || '{}');
        const task = await prisma.task.create({
            data: {
                title: data.title,
                description: data.description ?? null,
                deadline: data.deadline ?? null,
                priority: data.priority ?? 'LOW',
                status: data.status ?? 'TODO',
                tag: data.tag ?? null,
                user: { connect: { id: data.userId } },
                project: { connect: { id: data.projectId } },
            },
        });

        return {
            statusCode: 201,
            body: JSON.stringify(task),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to create task" }),
            headers: {
                "Content-Type": "application/json",
            },
        };
    } finally {
        await prisma.$disconnect();
    }
};
