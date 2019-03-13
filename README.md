# Smoke Signal
The purpose of Smoke Signal is to enable users to signal when a problem is encountered, and has blocked them from completing a task. When a user has encountered a problem, they simply "pull their cord". This notifies other users that a colleague is blocked and needs assistance. Users are able to associate helpful information with their issues, allowing "rescuers" to better help the blocked user. 

Rescuers are simply users that aid in issue resolution. An issue could also have one, or many rescuers. Once an issue has been resolved, the cord is no longer pulled. However, a user could still have other cords pulled for different issues. This allows a user to break a large problem down into smaller issues.

The overall goal of the application is to reduce time spent by users being blocked, encourage users to seek help sooner, and reward users for both helping and seeking help.


## Pre-requisites
The following items are required for this application to run.
  1. [Node.js](https://nodejs.org)
  2. [Vue-CLI-Service](https://cli.vuejs.org/guide/)
  3. [Smoke-Signal-Service](https://scmgr.eams.ericsson.net/incubation/smoke-signal-service)  
  
## Setup
This assumes that all pre-requisites have been met
  1. Install application dependencies: `npm install`
  2. Start the back-end (smoke-signal-service): `npm run start`
  3. Start the...
       a. Development server: `npm run serve`
       b. Production server: `npm run start` 
 
## Linting code
  1. ESLint: `npm run lint`

## Running Tests
  1. Unit tests: `npm run test:unit`
  2. E2E tests: `npm run test:e2e`
 
## Build for deployment
  1. *Be sure to run linter and all unit tests before building to ensure highest code quality!*
  2. Build: `npm run build`
 
 This will generate a "dist" directory, which can then be deployed to the hosting environment
 
## Using the template and components
The template comes with [Vuetify](https://vuetifyjs.com/en/), a component-based framework
for [Vue.js](https://vuejs.org/). Vuetify provides some pre-built components, and enables extension of those components.

### Using Ericsson Branding Standards with the Template
  - *Must be on ECN*: [Ericsson Brand house](https://brandhouse.ericsson.net/en)
  - *Must be on ECN*: [Ericsson Design System (EDS)](http://eds.internal.ericsson.com) 
  
  Ericsson has clearly defined standards for UI/UX, which differ from what Vuetify has defined as standard. To compensate
  for this, the `eColors.css` and `e-font.css` stylesheets have been included. Usage is simple!
  
  For example, if you have a card you can apply Ericsson styles as follows:
  ```
  <v-card :dark="isDark" :color="`accent ${darken}`" class="space-small">
     ...
  </v-card>
   ```
  
  So what's happening here? We leverage the attributes and properties, which Vuetify provides, but provide our own Ericsson
  styles to align with our branding guidelines.
  - The `:dark="isDark"` attribute leverages `themeMixin.js` to determine if the user has selected the dark or light
      theme.
  - The ```:color="`accent ${darken}`"``` attribute also leverages `themeMixin.js` to determine which layer the card is
      on, and applies the appropriate dark or light variant for that layer
  - The `class="space-small"` attribute controls the spacing (padding/margin) for the card. This is done by leveraging the
      pre-defined classes inside of `eColors.css`:
      
| .space-small   |  .space-base   |  .space-large   |  .space-xl   |  .space-xxl   |
|:-------------: |:-------------: |:--------------: |:-----------: |:------------: |
|     4px        |     8px        |     16px        |    24px      |    32px       |
   
  - You can also create your own classes using the mixins provided by the `eColors.css` stylesheet
      
## Using the mixins
There are a few mixins, which allow you to extend the basic functionality of a component quickly and easily.
Here is a list of the current mixins, with descriptions of what their intended usage is:
      
|    Mixin    | Description                                                                                                                                                 |
|:-----------:|-------------------------------------------------------------------------------------------------------------------------------------------------------------|
| alertMixin  | Provides access to the "alert" variables located in the Vuex store. Enables usage of the "alert" functionality for the component.                          |
| assetMixin  | Provides access to project-level assets; images, files, videos, etc.                                                                                       |
| authMixin   | Provides access to all authentication-related variables located in the Vuex store. Enables interaction with JWT, user data, and authentication information |
| badgeMixin  | Provides access to gamification-related store variables and methods                                                                                        |
| cordMixin   | Provides access to the cord store variables, and API endpoints for interacting with the back-end for cord retrieval/update                                 |
| socketMixin | Provides access to the socket store variables, and methods for interacting with the socket connection                                                      |
| themeMixin  | Provides access to variables which enable dark/light theme variants, switching between themes, and shades of theme layers                                  |
       
### Including a mixin within a component
   1. Import the mixin to the  component, use an import statement at the top of the component script tag: 
      `import { themeMixin } from "../mixins/themeMixin";`
   2. Then, in the `mixins` property of the component, add the mixins: `mixins: [themeMixin]` 
   3. Voila! You have successfully included a mixin in your component, and can take advantage of everything it has to offer      

### Services
Services are intended to provide a specific and reusable protocol for interaction with data.
  
|   Service   | Description                                                          |
|:-----------:|----------------------------------------------------------------------|
| themeService | Manage how Theme is being stored and retrieved from storage         |
| timeService  | Expose commonly used methods for interacting with time-related data |
| tokenService | Manage how Tokens are being stored and retrieved from storage       |
| userService  | Manage how User is being stored and retrieved from storage          |  

### Working with [VueX Store](https://vuex.vuejs.org/)
The application is stateful, and provides easy access to commonly used variables via the Store (`store.js`).
The store is intended to contain variables which may be used in multiple parts of the application, in order to reduce the need
to pass variables down the DOM-chain, or bubble events up the DOM-chain to modify those variables.

**The store should not be used for everything!** It is only intended to contain variables which are commonly used and
required by multiple views/components.

For a full guide on how the store works; how data is retrieved/updated, please see [this guide](https://vuex.vuejs.org/guide/)

### Environment Variables
Environment variables can be set and created by modifying the `.env`, `.env.development`, or `.env.production` files.
There is a detailed guide and explanation of how environment variables work in Vue.js [here](https://cli.vuejs.org/guide/mode-and-env.html#modes)!

When starting the application using `npm run serve`, or if the mode flag is set to `--development`, the application will run in development mode. 
This means that Vue will use the `.env.development` file for all environment variables. 

When starting the application using `npm run start`, or if the mode flag is set to `--production`, the application will run in production mode.
This means that Vue will use the `.env.production` file for all environment variables

```
.env                # loaded in all cases
.env.local          # loaded in all cases, ignored by git
.env.[mode]         # only loaded in specified mode
.env.[mode].local   # only loaded in specified mode, ignored by git
```

An env file for a specific mode (e.g. .env.production) will take higher priority than a generic one (e.g. .env).

In addition, environment variables that already exist when Vue CLI is executed have the highest priority and will not be overwritten by .env files.

### Deployment
The following steps are intended to be performed on the server which the application is being deployed to.
   0. Ensure that environment variables in `.env.production` file are updated and correct
   1. Build the application `npm run build`
   2. If deploying with docker: 
        ```
        docker build -t scmgr.eams.ericsson.net:5005/incubation/smoke-signal-service:latest . && docker push scmgr.eams.ericsson.net:5005/incubation/smoke-signal-service:latest
        ```
   2. If deploying as stand-alone: `npm run start`
   3. Test that the application works!
    
## Questions/Suggestions/Comments
Please contact Evan Bechtol <evan.bechtol@ericsson.com>
