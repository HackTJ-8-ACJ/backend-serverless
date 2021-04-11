import { CfnOutput } from "@aws-cdk/core";

export default function makeCfnOutput(this_, app, name, value){
    return new CfnOutput(this_, app.logicalPrefixedName(name), {
        value: value,
        exportName: app.logicalPrefixedName(name)
    })
}