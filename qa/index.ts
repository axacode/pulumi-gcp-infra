
import * as pulumi from "@pulumi/pulumi";
import * as gcp from "@pulumi/gcp";

// Define configuration variables
const config = new pulumi.Config();
const project = config.require("project");
const region = config.require("region");
const spannerInstanceName = config.require("spannerInstanceName");
const spannerDatabaseName = config.require("spannerDatabaseName");

// Create a Google Cloud Spanner instance
const spannerInstance = new gcp.spanner.Instance(spannerInstanceName, {
    config: `regional-${region}`,
    displayName: spannerInstanceName,
    numNodes: 1,
    project: project,
});

// Create a Google Cloud Spanner database
const spannerDatabase = new gcp.spanner.Database(spannerDatabaseName, {
    instance: spannerInstance.name,
    project: project,
    databaseDialect: "GOOGLE_STANDARD_SQL",
}, { dependsOn: [spannerInstance] });

// Export the instance and database names
export const instanceName = spannerInstance.name;
export const databaseName = spannerDatabase.name;
