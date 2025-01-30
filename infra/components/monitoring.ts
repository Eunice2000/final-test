import * as gcp from "@pulumi/gcp";

export function enableMonitoring() {
    return new gcp.projects.Service("monitoring", {
        service: "monitoring.googleapis.com",
    });
}

export function enableLogging() {
    return new gcp.projects.Service("logging", {
        service: "logging.googleapis.com",
    });
}
