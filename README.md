# Smoke Signal
  
## Setup
  1. Install dependencies: `npm install`
  2. Start the development server: `npm run serve`
 
## Linting code
  1. ESLint: `npm run lint`

## Running Tests
  1. Unit tests: `npm run test:unit`
  2. E2E tests: `npm run test:e2e`
 
## Build for deployment
  1. *Be sure to run linter and all unit tests before building to ensure highest code quality!*
  2. Build: `npm run build`
 
 This will generate a "build" directory, which can then be deployed to the hosting environment
 
## Using the template and components
The template comes with [Vuetify](The template comes with [Vuetify](https://vuetifyjs.com/en/), a component-based framework
for [Vue.js](https://vuejs.org/). Vuetify provides some pre-built components, and enables extension of those components.

### Using Ericsson Branding Standards with the Template
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
      
|    Mixin   | Description                                                                                                                                                |
|:----------:|------------------------------------------------------------------------------------------------------------------------------------------------------------|
| alertMixin | Provides access to the "alert" variables located in the Vuex store. Enables usage of the "alert" functionality for the component.                          |
| assetMixin | Provides access to project-level assets; images, files, videos, etc.                                                                                       |
| authMixin  | Provides access to all authentication-related variables located in the Vuex store. Enables interaction with JWT, user data, and authentication information |
| themeMixin | Provides access to variables which enable dark/light theme variants, switching between themes, and shades of theme layers                                  |
       
### Including a mixin within a component
   1. Import the mixin to the  component, use an import statement at the top of the component script tag: 
      `import { themeMixin } from "../mixins/themeMixin";`
   2. Then, in the `mixins` property of the component, add the mixins: `mixins: [themeMixin]` 
   3. Voila! You have successfully included a mixin in your component, and can take advantage of everything it has to offer      
        
## Questions/Suggestions/Comments
Please contact Evan Bechtol <evan.bechtol@ericsson.com>
