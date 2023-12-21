import {BaseContext} from "@apollo/server";
import {Request, Response} from "express";

export interface ContextType extends BaseContext {
    req: Request;
    res: Response;
    user?: string | null;
}