# Publishing Guide

This repository includes an automated GitHub Action workflow that publishes the extension to the Visual Studio Marketplace automatically after each release.

## Setup

### Required Secrets

To enable automatic publishing, you need to configure the following secret in your GitHub repository:

1. **MARKETPLACE_PAT**: A Personal Access Token (PAT) for the Visual Studio Marketplace

#### Creating a Marketplace PAT

1. Go to [Visual Studio Marketplace Publisher Management](https://marketplace.visualstudio.com/manage)
2. Click on your publisher account
3. Go to "Security" and create a new Personal Access Token
4. Set the following:
   - **Name**: GitHub Actions Publishing
   - **Organization**: All accessible organizations
   - **Expiration**: Set an appropriate expiration date
   - **Scopes**: Select "Marketplace (Publish)"
5. Copy the generated token

#### Adding the Secret to GitHub

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Click "New repository secret"
4. Name: `MARKETPLACE_PAT`
5. Value: Paste the token you created
6. Click "Add secret"

## Workflow Trigger

The workflow is triggered automatically when a new release is published on GitHub.

### Publishing Process

When a release is published:

1. The workflow checks out the code
2. Sets up Node.js 20
3. Installs dependencies and builds the task
4. Installs TFX CLI (Azure DevOps Extension Tool)
5. Packages the extension
6. Publishes the extension to the Visual Studio Marketplace

## Manual Publishing

If you need to publish manually, you can:

```bash
# Install dependencies and build
cd buildandreleasetask
npm run build
cd ..

# Install TFX CLI
npm install -g tfx-cli

# Package the extension
mkdir -p ./out
tfx extension create --manifest-globs vss-extension.json --output-path ./out

# Publish the extension
tfx extension publish --vsix ./out/*.vsix --auth-type pat --token YOUR_PAT_TOKEN
```

## Troubleshooting

- **Build Failures**: Check that all dependencies are correctly specified in `package.json`
- **Publishing Failures**: Verify that the `MARKETPLACE_PAT` secret is correctly configured and has not expired
- **Version Conflicts**: Ensure the version in `vss-extension.json` and `task.json` is updated before creating a release
