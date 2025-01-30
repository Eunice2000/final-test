export interface EnvironmentConfig {
    machineType: string;
    region: string;
    image: string;
    zone?: string;
    minInstances?: number; // Make minInstances optional
    maxInstances?: number; // Make maxInstances optional
}

export const environments: { [key: string]: EnvironmentConfig } = {
    development: {
        machineType: "e2-micro",
        region: "us-central1",
        zone: "us-central1-a",
        image: "debian-cloud/debian-11",
    },
    staging: {
        machineType: "e2-standard-2",   // Machine type for staging instances
        region: "us-central1",           // Region for staging resources
        zone: "us-central1-b",           // Zone for staging instances
        image: "debian-cloud/debian-11", // Image to use for staging instances
    },
    production: {
        machineType: "e2-standard-4",     // Machine type for production instances (if needed)
        region: "us-central1",            // Region for production resources
        zone: "us-central1-c",            // Zone for production instances
        image: "debian-cloud/debian-11",  // Image to use for production instances
    },
};
