import * as cdk from '@aws-cdk/core';
import * as lambda from "@aws-cdk/aws-lambda"
import { NodejsFunction, NodejsFunctionProps } from '@aws-cdk/aws-lambda-nodejs';
import { join, basename } from 'path';
import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import addCorsOptions from './add-cors';
import { iterateDir } from './iterate-api';
import { customAlphabet } from 'nanoid';
const nanoid = customAlphabet('abcdef',8)

const resourceMap = new Map();
export class ServerlessTestStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);


    // generic function props
    const nodeJsFunctionProps: NodejsFunctionProps = {
      bundling: {
        externalModules: [
          'aws-sdk', // Use the 'aws-sdk' available in the Lambda runtime
        ],
      },
      // depsLockFilePath: join(__dirname, 'lambdas', 'package-lock.json'),
      environment: {
        // environment vars are here
      },
      runtime:  lambda.Runtime.NODEJS_14_X,
    }

    const api = new RestApi(this, 'ItemsApi', {
      restApiName: 'Items Service'
    });

    // base directory for where the api lives
    const baseDir = join(__dirname, "/../api");

    resourceMap.set(baseDir, api.root);

    iterateDir(
      baseDir, 
      (baseDirName, direntName) => {
        // create a new resource on the api

        const baseResource = resourceMap.get(baseDirName);

        console.log(baseResource, baseDirName);

        const resource = baseResource.addResource ? baseResource.addResource(direntName):baseResource.root.addResource(direntName) ;

        // add the cors options
        addCorsOptions(resource);

        // set the map
        resourceMap.set(join(baseDirName, direntName), resource);
      },
      (baseDirName, direntName)=> {

        // TODO: function naming?

        const func = new NodejsFunction(this, nanoid(), {
          entry: join(baseDirName, direntName),
          ...nodeJsFunctionProps,
        });

        const funcInt = new LambdaIntegration(func);

        const resource = resourceMap.get(baseDirName);

        let [method] = direntName.split(".");

        if(method.toUpperCase() === "INDEX") method = "GET";

        resource.addMethod(method.toUpperCase(), funcInt);
      }
      );

  }
}