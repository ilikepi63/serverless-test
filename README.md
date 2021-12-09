# Serverless API with directory-based routing 

Similar to how the "Next" type of frontend frameworks do browser routing, this serverless project generates functions for each route
based on the function's location within the "api" directory.

Everything works exactly how a normal cdk app would! 

## Things to note

 * The configuration of each function is generic, based on a single Nodejs Function.
 * cors configurations are also applied to every method from a base "add-cors.ts" file

## Getting Started

 * `cdk deploy`      deploy this stack to your default AWS account/region