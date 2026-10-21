import { ZodError } from "zod";

export const ValidateDataMiddleware = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if(error instanceof ZodError) {
                const issues = error.issues || error.errors || [];
                const errorMessage = issues.map((issue) => ({
                    message: `${issue.path.join(".")} is ${issue.message}`,
                }));
                res.status(400).json({ error: "Invalid data", details: errorMessage});
            }else {
                res.status(500).json({ message: "Internal Server error"});
            }
        }
    };
}