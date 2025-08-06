class ApiError extends Error {
    statusCode: number;
    data: any;
    success: boolean;
    errors: any[];

    constructor(
        statusCode: number, message:string = "Something went wrong",
        errors: any[] = [],
        stack: string =""
    ) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.success = false;
        this.errors = errors;
        this.data = null;

        if(stack) {
            this.stack = stack;
        }
        else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError }