import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";

export function createServiceAccount(name: string) {
    return new gcp.serviceaccount.Account(name, {
        accountId: name,
        displayName: `Service account for ${name}`,
    });
}

export function assignIAMRole(serviceAccount: gcp.serviceaccount.Account, role: string) {
    return new gcp.projects.IAMMember(`${serviceAccount.name}-${role}`, {
        project: `shortlet-app-project`, // Provide the project ID
        member: pulumi.interpolate`serviceAccount:${serviceAccount.email}`,
        role: role,
    });
}