# Pulumi Workflow

This README provides an overview of the Pulumi Workflow defined in the GitHub Actions configuration file. This workflow automates the deployment process for Google Cloud Platform (GCP) infrastructure using Pulumi.

## Workflow Triggers

The workflow is triggered by the following events:
- `push` to any branch (`'**'`) if the changes affect the `dev/**` or `qa/**` paths.
- `pull_request` affecting the `dev/**` or `qa/**` paths.
- Manual trigger via `workflow_dispatch`, which requires an environment input (either `dev` or `qa`).

## Inputs

The `workflow_dispatch` trigger accepts the following input:
- `environment`: Specifies the environment to deploy or destroy. This is a required input with a default value of `dev`.

## Jobs

### Preview Job

The `preview` job runs on `ubuntu-latest` and performs the following steps:

1. **Checkout repository**:
   - Uses the `actions/checkout@v2` action to checkout the code.

2. **Set up Node.js**:
   - Uses the `actions/setup-node@v2` action to set up Node.js version 16.

3. **Install Google Cloud SDK**:
   - Adds the Google Cloud SDK repository and installs the SDK.

4. **Install dependencies**:
   - Navigates to the specified environment directory and installs Node.js dependencies using `npm install`.

5. **Install Pulumi CLI**:
   - Uses the `pulumi/setup-pulumi@v2` action to install the Pulumi CLI.

6. **Pulumi Login**:
   - Logs in to Pulumi using the access token stored in the repository secrets.

7. **Initialize Pulumi Stack**:
   - Selects or initializes the Pulumi stack for the specified environment.

8. **Set Pulumi Config**:
   - Sets various Pulumi configuration values, including GCP project ID, credentials, and environment-specific configurations such as Spanner instance and database names.

9. **Configure gcloud**:
   - Authenticates with GCP using the service account key and sets the GCP project configuration.

10. **Preview Pulumi Changes**:
    - Uses the `pulumi/actions@v3` action to preview the Pulumi changes for the specified environment.

### Deploy Job

The `deploy` job runs on `ubuntu-latest` and depends on the successful completion of the `preview` job. It only runs if the current branch is `main`. The steps are similar to the `preview` job, with an additional step for manual approval:

1. **Await Approval**:
   - Outputs a message indicating that manual approval is required to continue the deployment.

2. **Repeat Steps from Preview Job**:
   - Repeats the steps to checkout the repository, set up Node.js, install Google Cloud SDK, install dependencies, install Pulumi CLI, log in to Pulumi, initialize Pulumi stack, set Pulumi config, and configure gcloud.

3. **Deploy Pulumi Changes**:
   - Uses the `pulumi/actions@v3` action to deploy the Pulumi changes for the specified environment.

## Environment Variables

The workflow uses the following environment variables from GitHub Secrets:
- `PULUMI_ACCESS_TOKEN`: Pulumi access token for authentication.
- `GCP_PROJECT_ID`: GCP project ID.
- `GCP_CREDENTIALS`: GCP service account credentials.

## Note

Ensure that the required secrets (`PULUMI_ACCESS_TOKEN`, `GCP_PROJECT_ID`, `GCP_CREDENTIALS`) are configured in the GitHub repository settings.

This configuration automates the deployment process, providing a streamlined and efficient way to manage infrastructure as code using Pulumi and GitHub Actions.