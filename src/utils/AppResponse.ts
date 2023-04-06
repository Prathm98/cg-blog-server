export const AppStatus = {
    SUCCESS: "SUCCESS",
    ERROR: "ERROR",
    UNKNOWN: "UNKNOWN",
    UNAUTHORIZED: "UNAUTHORIZED"
}

export const AppResponse = (data: any, statusCode: Number = 200, error: any = null) => JSON.stringify({
    statusCode, data, error
})