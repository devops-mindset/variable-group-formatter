import tl = require('azure-pipelines-task-lib');
import * as azdev from "azure-devops-node-api";
import * as ta from "azure-devops-node-api/TaskAgentApi";
import * as ti from "azure-devops-node-api/interfaces/TaskAgentInterfaces";

async function run() {
    try {
        const projectId: string | undefined = tl.getVariable("System.TeamProjectId");
        const variableGroupID: string | undefined = tl.getInput('variableGroupID', true);
        const accessToken: string | undefined  = tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'ACCESSTOKEN', false);
        const endpointUrl: string |undefined=  tl.getEndpointUrl('SYSTEMVSSCONNECTION', false);
        if (variableGroupID == 'bad') {
            tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
            return;
        }
        let authHandler = azdev.getPersonalAccessTokenHandler(accessToken!); 
        let connection = new azdev.WebApi(endpointUrl!, authHandler);
        let vstsTask: ta.ITaskAgentApi = await connection.getTaskAgentApi();
        let formattedVariables:string = "";
        console.log(`Getting variable group id ${variableGroupID}`);
        vstsTask.getVariableGroup(projectId!,+variableGroupID!).then((variableGroup: ti.VariableGroup) => {
            console.log(`Got variable group ${variableGroup.name}`);
            for (let key in variableGroup.variables!) {
                formattedVariables +=  `-${key} "${variableGroup.variables![key].value}" `
            } 
            console.log("formattedVariables: "+formattedVariables);
            tl.setVariable('formattedVariables', formattedVariables);
        });

       
    
    }
    catch (err) {
        tl.setResult(tl.TaskResult.Failed, err.message);
    }
}

run();