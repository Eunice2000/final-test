import * as gcp from "@pulumi/gcp";

export function createVM(
    name: string,
    machineType: string,
    region: string | undefined,
    zone: string | undefined,
    image: string,
    vpc: gcp.compute.Network,
    subnet: gcp.compute.Subnetwork | undefined,
    serviceAccountEmail: string
) {
    return new gcp.compute.Instance(name, {
        name: name,
        machineType: machineType,
        zone: zone, // Leave undefined to let GCP pick the default zone
        bootDisk: {
            initializeParams: {
                image: image,
            },
        },
        networkInterfaces: [
            {
                network: vpc.id,
                subnetwork: subnet?.id, // Optional subnet
                accessConfigs: [
                    {
                        // Ephemeral IP
                        natIp: undefined,
                    },
                ],
            },
        ],
        serviceAccount: {
            email: serviceAccountEmail,
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        },
    });
}

export function createInstanceTemplate(
    name: string,
    machineType: string,
    region: string,
    image: string,
    subnet: gcp.compute.Subnetwork,
    serviceAccountEmail: string
): gcp.compute.InstanceTemplate {
    return new gcp.compute.InstanceTemplate(name, {
        region: region,
        machineType: machineType,
        disks: [{
            boot: true,
            autoDelete: true,
            // Correct nesting
            sourceImage: image, // Use sourceImage
        }],
        networkInterfaces: [{
            subnetwork: subnet.id,
            accessConfigs: [{}],
        }],
        serviceAccount: {
            email: serviceAccountEmail,
            scopes: ["https://www.googleapis.com/auth/cloud-platform"],
        },
    });
}

