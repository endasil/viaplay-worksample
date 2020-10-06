**Getting started**

After installing the node modules with npm install, just run node index.js in the root to run the application. The application should start and listen to port 1337 per default. I added two different ways of getting the URL for a trailer, one is taking the full URL and can be accessed by calling the app at: http://localhost:1337/film/trailer/url/{resourceUrl} where resourceUrl is the path to the viaplay movie resource. Example: 

 http://localhost:1337/film/trailer/https%3A%2F%2Fcontent.viaplay.se%2Fpc-se%2Ffilm%2Fbloodshot-2020

The other way is to use what is referred as the publicPath in the viaplay content api and let the app construct the complete url, like this 
http://localhost:1337/film/trailer/path/bloodshot-2020, personally I think that looks better.

Another way of testing the app is to run *npm run swagger* from the command while the app is running and the browser should open with swagger documentation.

**Structure of source code**

|   config.json  // Contains various configuration variables for the application.
|   index.js // Entrypoint of the application 
+---src  // Folder containing the main part of source code of the application
|   |   server.js  // Sets up a server that listens to incoming requests
|   |
|   +---controllers  // Contains the API controllers, entry point for external calls*
|   |   \+---film
|   |       +\---trailer
|   |               {resourceUrl}.js  // Route for getting trailers, the folder structure under controllers determine the route. 
|   |
|   +---dataAccess  // All calls to external endpoint goes under this folder, with names of files indicating the target
|   |       tmDbData.js
|   |       viaplayData.js
|   |
|   +---logic  // Folder containing logic code, often called from the controllers
|   |       filmLogic.js // File containing the
|   |
|   \+---utils // Various utility code used by the application
|           cacheManager.js  // Wrapper around node cache
|           logger.js  // Used setting up and loading the logger
|           makeRequest.js  // Request wrapper, Handles requests to external endpoints
|           config.js  // Loads configurations from config.json and allows for overriding from environment variables. 
+---swaggerConfig
|       swagger.json  // Used for setting up the API routes of the application, input variables, and type of requests
|
+---test  // All the tests goes under this folder
|   +---mocks  // Folder containing a recording of external requests to be played back during tests.
|   +---specs  // Contains files with the actual tests
|           getTrailer.spec.js
|           makeRequest.spec.js
|           ping.spec.js



The entry point of the application is *index.js* under the root. To make it easier for an automatic script I always have an index.js in the root as the entry point that then includes whatever file is needed.  In this case, it will load the server.js file and run the function "startServer" that will set it a server that listens to the port specified by *LISTEN_PORT* in *config.json*.  I use a tool called swaggerize-restify to set up the routing of the app. This will use a swagger JSON file (*swaggerConfig/swagger.json*) to describe the available endpoints and the parameters they take. The application will then look under controllers to find a file matching the route structure defined in the JSON file.

In the file *config.json* I set various constants. When using these in files I parse them trough the script in *config.js*. This one will look for any environment variables set with the same name and use them to override any value set in config.json. The reason I do this is to allow config values to easily be set to different values when deploying to different environments.

**Caching**

To make the application able to return values faster I use node-cache to store the trailer URL in memory after getting them. Right now I have a TTL value of 60 seconds to make it easier to test but would probably have a much longer time value of several days in production. I don't have any means of refreshing the cache if someone would change some relevant value in the Viaplay endpoint. If this is a single service and values are changes seldom it would just add an API endpoint for that. If it is a service that is changed more frequently and deploys on a cluster having it listening to events sent out on something like *RabbitMQ* would probably be a better idea. If this is a service deployed on a cluster instead of a single server a caching solution like *Redis* would probably be more suitable as it can coordinate cache between multiple instances. It also has support for automatically cleansing the least accessed values and storing values to disk if keeping information about 50 000 movie tiles in memory becomes an issue (since it was brought up in the task description). The reason I used *node-cache* instead of Redis is simply because it adds complexity and takes more time to implement, and I assume the main purpose of this task was to see my coding style ("Don't spend more than a few of hours on this", "It need not be production-ready".)

**Testing**

Regarding testing, I have done so by recording and playing back various responses from the external endpoints to mock different responses and trigger different paths. Then I simply call endpoint and check the responses. Tests can be run by typing **npm run test**. Coverage can be seen by typing **npm run coverage**. 