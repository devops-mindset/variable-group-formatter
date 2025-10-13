import tl = require('azure-pipelines-task-lib');
import * as azdev from "azure-devops-node-api";
import * as ta from "azure-devops-node-api/TaskAgentApi";
import * as ti from "azure-devops-node-api/interfaces/TaskAgentInterfaces";

async function run() {
    try {
        const projectId: string | undefined = tl.getVariable("System.TeamProjectId");
        const variableGroupID: string | undefined = tl.getInput('variableGroupID', true);
        const outputFormat: string | undefined = tl.getInput('outputFormat', true);
        const accessToken: string | undefined = tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'ACCESSTOKEN', false);
        const endpointUrl: string | undefined = tl.getEndpointUrl('SYSTEMVSSCONNECTION', false);
        if (variableGroupID == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
        let authHandler = azdev.getPersonalAccessTokenHandler(accessToken!);
        let connection = new azdev.WebApi(endpointUrl!, authHandler);
        let vstsTask: ta.ITaskAgentApi = await connection.getTaskAgentApi();
        let formattedVariables: string = "";
        console.log(`Getting variable group id ${variableGroupID}`);
        vstsTask.getVariableGroup(projectId!, +variableGroupID!).then((variableGroup: ti.VariableGroup) => {
            console.log(`Got variable group ${variableGroup.name}`);
            for (let key in variableGroup.variables!) {
                switch (outputFormat) {
                    case "Command Line Arguments":
                        formattedVariables += `-${key} "${variableGroup.variables![key].value}" `
                        break;
                    case "JSON":
                        formattedVariables += `{"name": "${key}" , "value" : "${variableGroup.variables![key].value}"},`
                        break;
                }
            }

            if (outputFormat == "JSON") {
                formattedVariables = `[${formattedVariables.slice(0,-1)}]`
            }
            console.log("formattedVariables: " + formattedVariables);
            tl.setVariable('formattedVariables', formattedVariables);
        });



    }
    catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        tl.setResult(tl.TaskResult.Failed, errorMessage);
    }
}

run();