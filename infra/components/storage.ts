import * as gcp from "@pulumi/gcp";

export function createStorageBucket(name: string) {
    return new gcp.storage.Bucket(name, {
        name: name,
        location: "US",
    });
}

export function uploadStaticAsset(bucket: gcp.storage.Bucket, filename: string, content: string) {
    return new gcp.storage.BucketObject(filename, {
        bucket: bucket.name,
        content: content,
        contentType: "text/html",
    });
}
