import {BaseContext} from "@apollo/server";
import {Request, Response} from "express";

export interface contextType extends BaseContext {
    req: Request;
    res: Response;
    user?: string | null;
}