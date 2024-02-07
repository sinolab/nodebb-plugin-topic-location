"use strict";

var plugin = {};
const Topics = require.main.require('./src/topics');

plugin.init = function (params, callback) {
    var app = params.router,
        middleware = params.middleware,
        controllers = params.controllers;
    console.log('nodebb-plugin-location-attributes: init');
    app.get('/api/custom/topic/:tid/locaton', async function (req, res, next) {
        try {
            const topicId = req.params.tid;
            console.log(`nodebb-plugin-location-attributes: /api/custom/topic/${topicId}/locaton`);

            // return responses
            const topic = await Topics.getTopicData(topicId);
            const latitude = parseFloat(topic.latitude);
            const longitude = parseFloat(topic.longitude);
            console.log(`nodebb-plugin-location-attributes: location: ${latitude}, ${longitude}`);

            return res.json({ location: { latitude, longitude } });
        } catch (error) {
            console.log(`nodebb-plugin-location-attributes: error: ${JSON.stringify(error)}`);
            return res.json({ error });
        }

    });

    const middlewares = [
        middleware.ensureLoggedIn,			
    ];

    // add put route wiht location attrubutes
    app.put('/api/custom/topic/:tid/locaton', middlewares, async function (req, res, next) {
        
        try {
            const topicId = req.params.tid;
            var { location } = req.body;
            // Ensure the user is logged in and has permission to edit the topic
            // //       if (!req.uid || !(await Topics.canEdit({ tid: topicId, uid: req.uid }))) {
            // //         return res.status(403).json({ error: 'Unauthorized' });
            // //       }

            console.log(`nodebb-plugin-location-attributes: /api/custom/topic/${topicId}/locaton: ${JSON.stringify(location)}`);

            await Topics.setTopicField(topicId, 'latitude', location.latitude);
            await Topics.setTopicField(topicId, 'longitude', location.longitude);

        } catch (error) {
            console.log(`nodebb-plugin-location-attributes: error: ${JSON.stringify(error)}`);
            return res.json({ error });
        }

        // return responses
        res.json({ success: true });
    });

    callback();
};

module.exports = plugin;