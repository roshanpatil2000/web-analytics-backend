import { Request, Response } from "express";
import { loadavg, totalmem, freemem } from "os";
import { errorResponse, successResponse } from "../utils/responseHandler";

export const healthcheckHandler = (req: Request, res: Response<any, Record<string, any>>) => {

    const loadAverage = loadavg();
    const totalMemory = totalmem();
    const freeMemory = freemem();
    const usedMemory = totalMemory - freeMemory;

    try {
        const serverStatus = {
            status: "OK",
            uptime: process.uptime(),
            timestamp: Date.now(),
            loadAverage: {
                '1min': loadAverage[0],
                '5min': loadAverage[1],
                '15min': loadAverage[2]
            },
            memory: {
                total: totalMemory,
                free: freeMemory,
                used: usedMemory
            },
        };
        return successResponse(res, { serverStatus });
    } catch (error) {
        return errorResponse(res, { message: 'Health check failed', details: (error as Error).message }, 500);
    }

}