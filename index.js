const Config = require('./config');

exports.register = function (server, options, next) {
	server.route({
        method: 'OPTIONS',
        path: '/{p*}',
        config: {
            handler: function(request, reply) {
                var response = reply();
                response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization';
				response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
                return response;
            },
            cors: true
        }
	});
	
	server.route({
        method: 'GET',
        path: '/{param*}',
        config: {
        	auth: false,
        	cors: true
        },
        handler: {
            directory: {
                path: Config.file_path,
                redirectToSlash: true,
                index: true,
            }
        }
    });

    const onPreHandler = function(request, reply) {
	    try {

	        // Ignore OPTIONS requests
	        if(request.route.method === 'options') {
	            return reply.continue();
	        }

	        const request_details = {
	        	method: request.method,
	        	query: request.query,
	        	payload: request.payload,
	        	params: request.params,
	        	headers: request.headers,
	        	info: request.info,
	        	auth: request.auth
	        }

	        request.server.app.logger.silly(request_details);
	        
	        reply.continue();
	    }
	    catch (err) {
	        reply(Boom.badRequest(err.message));
	    }
	};

	server.ext({
        type: 'onPreHandler',
        options: {
            sandbox: 'plugin'
        },
        method: onPreHandler
    });

	next();
};

exports.register.attributes = {
    pkg: require('./package.json')
};
