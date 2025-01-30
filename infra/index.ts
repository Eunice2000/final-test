import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";
import { createVPC, createSubnet, createFirewall } from "./components/network";
import { createVM, createInstanceTemplate } from "./components/compute-vm";
import { createServiceAccount, assignIAMRole } from "./components/serviceaccount";
import { environments } from "./components/variables";
import { enableMonitoring, enableLogging } from "./components/monitoring";
import { createStorageBucket, uploadStaticAsset } from "./components/storage";

const stack = pulumi.getStack() as keyof typeof environments;
const env = environments[stack];

// VPC and Networking
let vpc: gcp.compute.Network;
let subnet: gcp.compute.Subnetwork | undefined;

if (stack === "development") {
    // Use default VPC and its default subnet without specifying region/zone
    vpc = gcp.compute.Network.get("default", "default");
    subnet = undefined; // Subnet will not be explicitly referenced
} else {
    vpc = createVPC(`${stack}-vpc`);
    subnet = createSubnet(`${stack}-subnet`, vpc, "10.0.0.0/24", env.region);
    createFirewall(`${stack}-firewall`, vpc, ["22", "80", "443"]);
}

// Service Account
const serviceAccount = createServiceAccount(`${stack}-service-account`);
assignIAMRole(serviceAccount, "roles/secretmanager.secretAccessor");

serviceAccount.email.apply(email => {
    if (stack === "development") {
        // Create a VM without explicitly specifying a subnet or zone
        createVM(`${stack}-vm`, env.machineType, undefined, undefined, env.image, vpc, subnet, email);
    } else {
        if (!subnet) {
            throw new Error("Subnet is not defined for non-development environments.");
        }
        const instanceTemplate = createInstanceTemplate(
            `${stack}-template`,
            env.machineType,
            env.region,
            env.image,
            subnet,
            email
        );
    }
});

// Monitoring and Logging
enableMonitoring();
enableLogging();

// Cloud Storage (only for development)
if (stack === "development") {
    const bucket = createStorageBucket(`shorlet-static-file`);
    uploadStaticAsset(bucket, "index.html", "<html><body>Hello World</body></html>");
}

export {}; // Explicitly export for Pulumi
