define(['backbone', 'underscore'], function(Backbone, _) {
    var Formation = Backbone.Model.extend({
        defaults: {
            "tactic": "442",
            "attackers": [
                "7": "",
                "9": "",
                "11": "",
            ]
            "midfielders": [
                "6": "",
                "8": "",
                "10": "",
            ],
            "defenders": {
                "2": "",
                "3": "",
                "4": "",
                "5": ""
            }
        }
    });

    return Formation;
})
