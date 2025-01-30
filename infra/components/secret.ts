import * as gcp from "@pulumi/gcp";
import * as pulumi from "@pulumi/pulumi";

export function createSecret(name: string) {
    return new gcp.secretmanager.Secret(name, {
        secretId: name,
        replication: { auto: {} },
    });
}

export function createSecretVersion(secret: gcp.secretmanager.Secret, data: string) {
    return new gcp.secretmanager.SecretVersion(`${secret.name}-version`, {
        secret: secret.id,
        secretData: data,
    });
}

export function grantSecretAccess(serviceAccountEmail: pulumi.Output<string>, secret: gcp.secretmanager.Secret) {
    return new gcp.secretmanager.SecretIamMember(`${secret.name}-access`, {
        secretId: secret.id,
        member: pulumi.interpolate`serviceAccount:${serviceAccountEmail}`,
        role: "roles/secretmanager.secretAccessor",
    });
}
