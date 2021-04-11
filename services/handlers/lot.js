import { success, failure } from "../libs/response-lib";
import { v4 as uuid } from 'uuid';
import { dynamo } from "../libs/dynamodb";

export const create = async (event, context) => {
    try {
        const body = JSON.parse(event.body);

        let coords = body.spaces ? body.spaces : undefined;
        if (body.grid) {
            coords = [];
            for (let i = 0; i < body.grid.x; i++)
                for (let j = 0; j < body.grid.y; j++)
                    coords.push({
                        x: i,
                        y: j
                    });
        }
        if(!coords) throw Error("define spaces or grid");

        const spaces = coords.map((coord) => {
            return {
                id: uuid(),
                x: coord.x,
                y: coord.y,
                filled: body.default ? body.default : false
            };
        });

        const lotItem = {
            id: uuid(),
            spaces
        };

        await dynamo.put({
            TableName: process.env.lotsTableName,
            Item: lotItem,

        }).promise();

        return success({lot: lotItem});


    } catch (e) {
        return failure(e);
    }
};

export const update = async (event, context) => {
    try {
        const body = JSON.parse(event.body);

        if(!body.lotId) throw Error("must pass lotId");
        if(!body.updates) throw Error("must provide updates or [] for no updates");

        // get lot
        let lot = (await dynamo.get({
            TableName: process.env.lotsTableName,
            Key: {
                id: body.lotId
            }
        }).promise()).Item;

        if(!lot) throw Error("lot not found");

        // process updates
        const updatesMap = {};
        body.updates.forEach((update) => {
            updatesMap[update.sensorId] = update.filled;
        });

        // update spaces
        for(let space of lot.spaces){
            if(updatesMap[space.id]){
                space.filled = updatesMap[space.id];
            }
        }

        // make update in db
        await dynamo.update({
            TableName: process.env.lotsTableName,
            Key: {
                id: body.lotId
            },
            UpdateExpression: "SET #spaces = :spaces",
            ExpressionAttributeNames: {
                "#spaces": "spaces"
            },
            ExpressionAttributeValues: {
                ":spaces": lot.spaces
            }
        }).promise();

        if(!body.updates) throw Error("must pass sensorId");

        return success({lot: lot});

    } catch (e){
        return failure(e);
    }
};
