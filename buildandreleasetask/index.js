"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const tl = require("azure-pipelines-task-lib");
const azdev = __importStar(require("azure-devops-node-api"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const projectId = tl.getVariable("System.TeamProjectId");
            const variableGroupID = tl.getInput('variableGroupID', true);
            const outputFormat = tl.getInput('outputFormat', true);
            const accessToken = tl.getEndpointAuthorizationParameter('SYSTEMVSSCONNECTION', 'ACCESSTOKEN', false);
            const endpointUrl = tl.getEndpointUrl('SYSTEMVSSCONNECTION', false);
            if (variableGroupID == 'bad') {
                tl.setResult(tl.TaskResult.Failed, 'Bad input was given');
                return;
            }
            let authHandler = azdev.getPersonalAccessTokenHandler(accessToken);
            let connection = new azdev.WebApi(endpointUrl, authHandler);
            let vstsTask = yield connection.getTaskAgentApi();
            let formattedVariables = "";
            console.log(`Getting variable group id ${variableGroupID}`);
            vstsTask.getVariableGroup(projectId, +variableGroupID).then((variableGroup) => {
                console.log(`Got variable group ${variableGroup.name}`);
                for (let key in variableGroup.variables) {
                    switch (outputFormat) {
                        case "Command Line Arguments":
                            formattedVariables += `-${key} "${variableGroup.variables[key].value}" `;
                            break;
                        case "JSON":
                            formattedVariables += `{"name": "${key}" , "value" : "${variableGroup.variables[key].value}"},`;
                            break;
                    }
                }
                if (outputFormat == "JSON") {
                    formattedVariables = `[${formattedVariables.slice(0, -1)}]`;
                }
                console.log("formattedVariables: " + formattedVariables);
                tl.setVariable('formattedVariables', formattedVariables);
            });
        }
        catch (err) {
            tl.setResult(tl.TaskResult.Failed, err.message);
        }
    });
}
run();
