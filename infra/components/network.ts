import * as gcp from "@pulumi/gcp";

export function createVPC(name: string, autoCreateSubnetworks: boolean = false) {
    return new gcp.compute.Network(name, {
        autoCreateSubnetworks: autoCreateSubnetworks,
    });
}

export function createSubnet(name: string, vpc: gcp.compute.Network, cidrBlock: string, region: string) {
    return new gcp.compute.Subnetwork(name, {
        ipCidrRange: cidrBlock,
        network: vpc.id,
        region: region,
    });
}

export function createFirewall(name: string, vpc: gcp.compute.Network, allowedPorts: string[]) {
    return new gcp.compute.Firewall(name, {
        network: vpc.id,
        allows: [
            {
                protocol: "tcp",
                ports: allowedPorts,
            },
        ],
        sourceRanges: ["0.0.0.0/0"], // Restrict in production!
    });
}
