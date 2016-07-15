
/*
Pipeline step 1
- Unwind all of the entries array to individual documents.
*/
var ps1 = { $unwind: "$log.entries" };

/*
Pipeline step 2
- Only project (include) the method and url in the request as 'verb' and 'path'.
*/
var ps2 = {
    $project: {
        verb: "$log.entries.request.method",
        path: "$log.entries.request.url"

    }
};

/*
Pipeline step 3
- Group on path as id to remove duplicate paths.
*/
var ps3 = {
    $group: {
        "_id": "$path",
        "verb": { $first: "$verb" }
    }
};

/*
Pipeline step 4
- Sort by path ascending.
*/
var ps4 = {
    $sort: {
        "_id": 1
    }
};

/*
Pipeline step 5
- Group on null id to consolidate to a single document.
- Push the path and verb to a 'requests' array.
*/
var ps5 = {
    $group: {
        "_id": null,
        "requests": {
            "$push": {
                "path": "$_id",
                "verb": "$verb"
            }
        }
    }
};

/*
Pipeline step 6
- Use project to strip the _id field and leave the rest.
*/
var ps6 = {
    "$project": {
        "_id": 0,
        "requests.path": 1,
        "requests.verb": 1
    }
};

/*
Pipeline Array
*/
var pipeline = [
    ps1, 
    ps2, 
    ps3, 
    ps4, 
    ps5, 
    ps6
];

db.MyCollection.aggregate(pipeline);
