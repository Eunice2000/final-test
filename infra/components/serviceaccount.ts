import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";

export function createServiceAccount(name: string) {
    return new gcp.serviceaccount.Account(name, {
        accountId: name,
        displayName: `Service account for ${name}`,
    });
}

