# Amazon QuickSight Embedding SDK
&nbsp;  
Thank you for using the Amazon QuickSight JavaScript SDK. You can use this SDK to embed Amazon QuickSight in your HTML.

For more information and to learn how to use QuickSight Embedding, please visit [QuickSight Developer Portal Website](https://developer.quicksight.aws/)

Amazon QuickSight offers four different embedding experiences with options for user isolation with namespaces, and custom UI permissions.

* [Dashboard Embedding](#dashboard-embedding)
* [Visual Embedding](#visual-embedding)
* [Console Embedding](#console-embedding)
* [QSearchBar Embedding](#qsearchbar-embedding)


&nbsp;  
## Installation
&nbsp;

**Option 1:** Use the Amazon QuickSight Embedding SDK in the browser:
```html
...
<script src="https://unpkg.com/amazon-quicksight-embedding-sdk@2.0.3/dist/quicksight-embedding-js-sdk.min.js"></script>
<script type="text/javascript">
    const onLoad = async () => {
        const embeddingContext = await QuickSightEmbedding.createEmbeddingContext();
        //...
    };
</script>
...
<body onload="onLoad()">
...
```

**Option 2:** Install the Amazon QuickSight Embedding SDK in NodeJs:
```shell
npm install amazon-quicksight-embedding-sdk
```
and then use it in your code using `require` syntax
```javascript
const QuickSightEmbedding = require("amazon-quicksight-embedding-sdk");

const embeddingContext = await QuickSightEmbedding.createEmbeddingContext();
```

or, using named `import` syntax:

```javascript
import { createEmbeddingContext } from 'amazon-quicksight-embedding-sdk';

const embeddingContext = await createEmbeddingContext();
```

or, using wildcard `import` syntax:

```javascript
import * as QuickSightEmbedding from 'amazon-quicksight-embedding-sdk';

const embeddingContext = await QuickSightEmbedding.createEmbeddingContext();
```

&nbsp;  
## Creating the Embedding Context
&nbsp;  

Use `createEmbeddingContext` method to create an embedding context. It returns a promise of `EmbeddingContext` type.

```typescript

export type CreateEmbeddingContext = (frameOptions?: CreateEmbeddingContextFrameOptions) => Promise<EmbeddingContext>;

export type SimpleChangeEventHandler = (message: SimpleChangeEvent, metadata?: ExperienceFrameMetadata) => void;

export type CreateEmbeddingContextFrameOptions = {
    onChange?: SimpleChangeEventHandler;
};

export type EmbeddingContext = {
    embedDashboard: EmbedDashboard;
    embedVisual: EmbedVisual;
    embedQSearchBar: EmbedQSearch;
    embedConsole: EmbedConsole;
};
```

You can create the embedding context by calling `createEmbeddingContext` method without any arguments
```javascript
import { createEmbeddingContext } from 'amazon-quicksight-embedding-sdk';

const embeddingContext: EmbeddingContext = await createEmbeddingContext();

```

or, you can pass an object argument with `onChange` property

```javascript
import { createEmbeddingContext } from 'amazon-quicksight-embedding-sdk';

const embeddingContext: EmbeddingContext = await createEmbeddingContext({
    onChange: (changeEvent) => {
        console.log('Context received a change', changeEvent);
    },
});
```

The embedding context creates an additional zero-pixel iframe and appends it into the `body` element on the page to centralize communication between the SDK and the embedded QuickSight content.

&nbsp;  
## Embedding the Amazon QuickSight Experiences
&nbsp;  

An `EmbeddingContext` instance exposes 4 experience methods

* embedDashboard
* embedVisual
* embedQSearchBar
* embedConsole

These methods take 2 parameters:

* frameOptions (required)
* contentOptions (optional)

&nbsp;  
### Example
&nbsp;  

```typescript
import { createEmbeddingContext } from 'amazon-quicksight-embedding-sdk';

const embeddingContext = await createEmbeddingContext();

const {
    embedDashboard,
    embedVisual,
    embedConsole,
    embedQSearchBar,
} = embeddingContext;

const frameOptions = {
    //...
};
const contentOptions = {
    //...
};

// Embedding a dashboard experience
const embeddedDashboardExperience = await embedDashboard(frameOptions, contentOptions);

// Embedding a visual experience
const embeddedVisualExperience = await embedVisual(frameOptions, contentOptions);

// Embedding a console experience
const embeddedConsoleExperience = await embedConsole(frameOptions, contentOptions);

// Embedding a Q search bar experience
const embeddedQSearchExperience = await embedQSearchBar(frameOptions, contentOptions);

```

&nbsp;  
### Common Properties of `frameOptions` for All Embedding Experiences
&nbsp;  

#### 🔹 url: *string* *(required)*

This is the embed URL you have generated using the [QuickSight API Operations for Embedding](https://docs.aws.amazon.com/en_us/quicksight/latest/APIReference/embedding-quicksight.html).

Follow [Embedding with the QuickSight API](https://docs.aws.amazon.com/quicksight/latest/user/embedded-analytics-api.html) in the Amazon QuickSight User Guide to generate the url.

For each experience, you need to make sure that the users are granted the necessary permissions to view the embedded experience.

#### 🔹 container: *string | HTMLElement* *(required)*

This is the parent HTMLElement where we're going to embed QuickSight.

It can be an HTMLElement:
```javascript
    container: document.getElementById("experience-container")
```
Or, it can be a query selector string:
```javascript
    container: "#experience-container"
```

#### 🔹 width: *string* *(optional, default='100%')*,
You can set `width` for the iframe that holds your embedded QuickSight experience. You can set it to be a fixed value:
```javascript
    width: "1000px"
```
Or, a relative value:
```javascript
    width: "60%"
```

To make your embedded QuickSight experience responsive, don't set it (leave them at the default: `100%`). Then you can make the container HTMLElement responsive to screen size change.

#### 🔹 height: *string* *(optional, default='100%')*

You can set `height` for the iframe that holds your embedded QuickSight experience. You can set it to be a fixed value:
```javascript
    height: "700px"
```

Or, a relative value:
```javascript
    height: "80%"
```

To make your embedded QuickSight experience responsive, don't set it (leave them at the default: `100%`). Then you can make the container HTMLElement responsive to screen size change.

#### 🔹 className: *string* *(optional)*

You can customize style of the iframe that holds your embedded experience by one of the followings:

-  Option 1: Use the "quicksight-embedding-iframe" class we predefined for you:
```
.quicksight-embedding-iframe {
    margin: 5px;
}
```
-  Option 2: Or, create your own class and pass in through `className` property:
```
.your-own-class {
    margin: 5px;
}
```
```javascript
    className: "your-own-class",
```

We've overridden the border and padding of the iframe to be 0px, because setting border and padding on the iframe might cause unexpected issues. If you have to set border and padding on the embedded QuickSight session, set it on the container div that contains the iframe.

#### 🔹 withIframePlaceholder: *boolean* *(optional, default=false)*

It renders a simple spinner in the embedded experience container while the contents of the embedding experience iframe is being loaded.

#### 🔹 onChange: *SimpleChangeEventHandler* *(optional)*

This callback is invoked when there is a change in the SDK code status.

```
export type SimpleChangeEventHandler = (message: SimpleChangeEvent, metadata?: ExperienceFrameMetadata) => void;

export interface SimpleChangeEvent {
    eventName: ChangeEventName;
    eventLevel: ChangeEventLevel;
    message?: string;
    data?: any;
}

export type ExperienceFrameMetadata = {
    frame: EmbeddingIFrameElement;
};
```

Supported `eventLevel`s:

    ERROR
    INFO
    WARN

`ErrorChangeEventName`s

    NO_FRAME_OPTIONS = 'NO_FRAME_OPTIONS',
    INVALID_FRAME_OPTIONS = 'INVALID_FRAME_OPTIONS',
    FRAME_NOT_CREATED: invoked when the creation of the iframe element failed
    NO_BODY: invoked when there is no `body` element in the hosting html
    NO_CONTAINER: invoked when the experience container is not found
    INVALID_CONTAINER: invoked when the container provided is not a valid DOM node
    NO_URL: invoked when no url is provided in the frameOptions 
    INVALID_URL: invoked when the url provided is not a valid url for the experience
    NO_FRAME_OPTIONS: invoked when frameOptions property is not populated,
    INVALID_FRAME_OPTIONS: invoked when the frameOptions value is not object type,

`InfoChangeEventName`s

    FRAME_STARTED: invoked just before the iframe is created
    FRAME_MOUNTED: invoked after the iframe is appended into the experience container
    FRAME_LOADED: invoked after iframe element emited the `load` event

`WarnChangeEventName`s

    UNRECOGNIZED_CONTENT_OPTIONS: invoked when the content options for the experience contain unrecognized properties
    UNRECOGNIZED_FRAME_OPTIONS: invoked when the frame options for the experience contain unrecognized properties
    UNRECOGNIZED_EVENT_TARGET: invoked when a message with unrecognized event target is received


```javascript
const frameOptions = {
    //...
    onChange: (changeEvent, metadata) => {
        if (changeEvent.eventLevel === 'ERROR') {
            console.log(`Do something when embedding experience failed with "${changeEvent.eventName}"`);
            return;
        }
        switch (changeEvent.eventName) {
            case 'FRAME_MOUNTED': {
                console.log("Do something when the experience frame is mounted.");
                break;
            }
            case 'FRAME_LOADED': {
                console.log("Do something when the experience frame is loaded.");
                break;
            }
            //...
        }
    },
};
```

&nbsp;  
### Common Properties of `contentOptions` for All Embedding Experiences
&nbsp;  


#### 🔹 locale: *string* *(optional)* (not available in QSearchBar embedding)

You can set locale for the embedded QuickSight session:
```javascript
    locale: "en-US",
```
Available locale options are:
```
en-US (English),
da-DK (Dansk)
de-DE (Deutsch),
ja-JP (日本語),
es-ES (Español),
fr-FR (Français),
it-IT (Italiano),
nl-NL (Nederlands),
nb-NO (Norsk),
pt-BR (Português),
fi-FI (Suomi),
sv-SE (Svenska),
ja-JP (日本語),
ko-KR (한국어),
zh-CN (中文 (简体)),
zh-TW (中文 (繁體))
```

For a more updated list of locales, please refer to https://docs.aws.amazon.com/quicksight/latest/user/choosing-a-language-in-quicksight.html. Any unsupported locale value will fallback to using `en-US`.


#### 🔹 onMessage: *SimpleMessageEventHandler* *(optional)*

You can add `onMessage` callback into the `contentOptions` of all embedding experiences. 

```typescript
export type SimpleMessageEventHandler = (message: SimpleMessageEvent, metadata?: ExperienceFrameMetadata) => void;

export interface SimpleMessageEvent {
    eventName: MessageEventName;
    message?: any;
}

export type ExperienceFrameMetadata = {
    frame: EmbeddingIFrameElement;
};

```

See the experience specific documentation below for the supported `eventName`s for each experience type. 

```typescript

const contentOptions = {
    //...
    onMessage: async (messageEvent, experienceMetadata) => {
        switch (messageEvent.eventName) {
            case 'CONTENT_LOADED': {
                console.log("Do something when the embedded experience is fully loaded.");
                break;
            }
            case 'ERROR_OCCURRED': {
                console.log("Do something when the embedded experience fails loading.");
                break;
            }
            //...
        }
    }
};
```

***

&nbsp;  
## Dashboard Embedding
&nbsp;  

Dashboard Embedding provides an interactive read-only experience. The level of interactivity is set when the dashboard is published.

For more information, see  [Working with embedded analytics](https://docs.aws.amazon.com/quicksight/latest/user/embedded-analytics.html) in the Amazon QuickSight User Guide.

&nbsp;  
### Getting Started
&nbsp;  

Use `embedDashboard` method to embed a QuickSight dashboard. It returns a promise of `DashboardFrame` type.

```typescript
// Getters
export type GetParameters = () => Promise<Parameter[]>;
export type GetSheets = () => Promise<Sheet[]>;
export type GetSelectedSheetId = () => Promise<string>;

// Setters
export type SetParameters = (parameters: Parameter[]) => Promise<ResponseMessage>;
export type SetSelectedSheetId = (sheetId: string) => Promise<ResponseMessage>;

// Invokers
export type InitiatePrint = () => Promise<ResponseMessage>;
export type Undo = () => Promise<ResponseMessage>;
export type Redo = () => Promise<ResponseMessage>;
export type Reset = () => Promise<ResponseMessage>;
export type NavigateToDashboard = (dashboardId: string, options?: NavigateToDashboardOptions) => Promise<ResponseMessage>;

export interface DashboardFrame extends BaseFrame {
    getParameters: GetParameters;
    getSheets: GetSheets;
    getSelectedSheetId: GetSelectedSheetId;
    setParameters: SetParameters;
    setSelectedSheetId: SetSelectedSheetId;
    initiatePrint: InitiatePrint;
    undo: Undo;
    redo: Redo;
    reset: Reset;
    navigateToDashboard: NavigateToDashboard;
}

export type Send = (eventName: MessageEventName, message?: any) => void;

export interface BaseFrame {
    send: Send;
}

```

&nbsp;  
### Example
&nbsp;  

```html
<!DOCTYPE html>
<html>

    <head>
        <title>Dashboard Embedding Example</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@2.0.3/dist/quicksight-embedding-js-sdk.min.js"></script>
        <script type="text/javascript">
            const embedDashboard = async() => {
                const {
                    createEmbeddingContext,
                } = QuickSightEmbedding;

                const embeddingContext = await createEmbeddingContext({
                    onChange: (changeEvent, metadata) => {
                        console.log('Context received a change', changeEvent, metadata);
                    },
                });

                const frameOptions = {
                    url: '<YOUR_EMBED_URL>',
                    container: '#experience-container',
                    height: "700px",
                    width: "300px",
                    resizeHeightOnSizeChangedEvent: true,
                    onChange: (changeEvent, metadata) => {
                        switch (changeEvent.eventName) {
                            case 'FRAME_MOUNTED': {
                                console.log("Do something when the experience frame is mounted.");
                                break;
                            }
                            case 'FRAME_LOADED': {
                                console.log("Do something when the experience frame is loaded.");
                                break;
                            }
                        }
                    },
                };

                const contentOptions = {
                    parameters: [
                        {
                            Name: 'country',
                            Values: [
                                'United States'
                            ],
                        },
                        {
                            Name: 'states',
                            Values: [
                                'California',
                                'Washington'
                            ]
                        }
                    ],
                    locale: "en-US",
                    sheetOptions: {
                        initialSheetId: '<YOUR_SHEETID>',
                        singleSheet: false,                        
                        emitSizeChangedEventOnSheetChange: false,
                    },
                    toolbarOptions: {
                        export: false,
                        undoRedo: false,
                        reset: false
                    },
                    attributionOptions: {
                        overlayContent: false,
                    },
                    onMessage: async (messageEvent, experienceMetadata) => {
                        switch (messageEvent.eventName) {
                            case 'CONTENT_LOADED': {
                                console.log("All visuals are loaded. The title of the document:", messageEvent.message.title);
                                break;
                            }
                            case 'ERROR_OCCURRED': {
                                console.log("Error occurred while rendering the experience. Error code:", messageEvent.message.errorCode);
                                break;
                            }
                            case 'PARAMETERS_CHANGED': {
                                console.log("Parameters changed. Changed parameters:", messageEvent.message.changedParameters);
                                break;
                            }
                            case 'SELECTED_SHEET_CHANGED': {
                                console.log("Selected sheet changed. Selected sheet:", messageEvent.message.selectedSheet);
                                break;
                            }
                            case 'SIZE_CHANGED': {
                                console.log("Size changed. New dimensions:", messageEvent.message);
                                break;
                            }
                            case 'MODAL_OPENED': {
                                window.scrollTo({
                                    top: 0 // iframe top position
                                });
                                break;
                            }
                        }
                    },
                };
                const embeddedDashboardExperience = await embeddingContext.embedDashboard(frameOptions, contentOptions);

                const selectCountryElement = document.getElementById('country');
                selectCountryElement.addEventListener('change', (event) => {
                    embeddedDashboardExperience.setParameters([
                        {
                            Name: 'country',
                            Values: event.target.value
                        }
                    ]);
                });
            };
        </script>
    </head>

    <body onload="embedDashboard()">
        <span>
            <label for="country">Country</label>
            <select id="country" name="country">
                <option value="United States">United States</option>
                <option value="Mexico">Mexico</option>
                <option value="Canada">Canada</option>
            </select>
        </span>
        <div id="experience-container"></div>
    </body>

</html>
```

&nbsp;  
### `frameOptions`
&nbsp; 

See [Common Properties of `frameOptions` for All Embedding Experiences](#common-properties-of-frameoptions-for-all-embedding-experiences) for `url`, `container`, `width`, `height`, `className`, `withIframePlaceholder`, `onChange` properties

&nbsp;  
#### resizeHeightOnSizeChangedEvent: *boolean* *(optional, default: false)*

Use `resizeHeightOnSizeChangedEvent` to allow changing the iframe height when the height of the embedded content changed.
```javascript
    height: "300px",
    resizeHeightOnSizeChangedEvent: true
```

When the `resizeHeightOnSizeChangedEvent` property is set to true, the value of the `height` property acts as a loading height.

Note: With the `resizeHeightOnSizeChangedEvent` set to true, modals generated by the dashboard can be hidden if the content is larger than the screen. An example of this type of modal is the one that displays when you select "Export to CSV" on a Table visual. To solve this issue, you can add the following code to autoscroll the focus to the modal.
```javascript
const contentOptions = {
    //...
    onMessage: (messageEvent, metadata) => {
        switch (messageEvent.eventName) {
            case 'MODAL_OPENED': {
                window.scrollTo({
                    top: 0 // iframe top position
                });
                break;
            }
            //...
        }
    },
}
```

&nbsp;  
### `contentOptions`
&nbsp; 

See [Common Properties of `contentOptions` for All Embedding Experiences](#common-properties-of-contentoptions-for-all-embedding-experiences) for `locale` property

&nbsp;  
#### 🔹 parameters: *Parameter[]* *(optional)*

It allows you to set initial parameter values for your embedded QuickSight dashboard. Pass an array as value for multi-value parameters.
For more information about parameters in Amazon QuickSight, see https://docs.aws.amazon.com/quicksight/latest/user/parameters-in-quicksight.html

#### 🔹 toolbarOptions

If sub-properties of the toolbarOptions are set to false, then the navrbar is hidden.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 export: *boolean* *(optional, default=false)*
This can be used to show or hide export icon for dashboard embedding. 

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 undoRedo: *boolean* *(optional, default=false)*
This can be used to show or hide the undo and redo buttons for dashboard embedding.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 reset: *boolean* *(optional, default=false)*
This can be used to show or hide the reset button for dashboard embedding.

#### 🔹 sheetOptions

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 initialSheetId: *string* *(optional)*
You can use this when you want to specify the initial sheet of the dashboard, instead of loading the first sheet of the embedded dashboard. You can provide the target sheet id of the dashboard as the value. In case the sheet id value is invalid, the first sheet of the dashboard will be loaded.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 singleSheet: *boolean* *(optional, default=false)*
The `singleSheet` property can be used to enable or disable sheet tab controls in dashboard embedding.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 emitSizeChangedEventOnSheetChange: *boolean* (optional default=false)
You can use this in combination with `resizeHeightOnSizeChangedEvent: true` frame option, when you want the embedded dashboard height to auto resize based on sheet height, on every sheet change event.

#### 🔹 attributionOptions

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 overlayContent: *boolean* *(optional, default=false)*

We add 22 pixels of additional height at the bottom of the layout to provide dedicated space to the "Powered by QuickSight" footer.
You can set this property to `true` to overlay it with your content.

#### 🔹 onMessage: *SimpleMessageEventHandler* *(optional)*

The `eventName`s the dashboard experience receive

    CONTENT_LOADED: Received when the visuals of the Amazon QuickSight dashboard are fully loaded
    ERROR_OCCURRED: Received when an error occurred while rendering the visuals of the Amazon QuickSight dashboard. The message contains `errorCode`. The error codes are:
    - `Forbidden` -- the URL's authentication code expired
    - `Unauthorized` -- the session obtained from the authentication code expired
    If you follow the instructions to generate the correct URL, but you still receive these error codes, you need to generate a new URL.
    PARAMETERS_CHANGED: Received when the parameters in Amazon QuickSight dashboard changes.
    SELECTED_SHEET_CHANGED: Received when the selected sheet in Amazon QuickSight dashboard changes.
    SIZE_CHANGED: Received when the size of the Amazon QuickSight dashboard changes.
    MODAL_OPENED: Received when a modal opened in Amazon QuickSight dashboard.

&nbsp;  
### Actions
&nbsp;  

#### 🔹 setParameters: *(parameters: Parameter[]) => Promise<ResponseMessage>;*

Use this function to update parameter values. Pass an array as value for multi-value parameters.
You can build your own UI to trigger this, so that viewers of the embedded QuickSight session can control it from your app page.

Parameters in an embedded experience session can be set by using the following call:
```javascript
    embeddedExperience.setParameters([
        {
            Name: 'country',
            Values: ['United States'],
        },
        {
            Name: 'states'
            Values: ['California', 'Washington'],
        }
    ]);
```

To reset a parameter so that it includes all values, you can pass the string `ALL_VALUES`.
```javascript
    embeddedExperience.setParameters([
        {
            Name: 'states'
            Values: ['ALL_VALUES'],
        }
    ]);
```

#### 🔹 navigateToDashboard *(dashboardId: string, options?: NavigateToDashboardOptions) => Promise<ResponseMessage>*

To navigate to a different dashboard, use dashboard.navigateToDashboard(options). The input parameter options should contain the dashboardId that you want to navigate to, and also the parameters for that dashboard, for example:
```javascript
    const dashboardId: "37a99f75-8230-4409-ac52-e45c652cc21e",
    const options = {
        parameters: [
            {
                Name: 'country',
                Values: ['United States'],
            }
        ]
    };
    embeddedDashboardExperience.navigateToDashboard(dashboardId, options);
```

#### 🔹 setSelectedSheetId *(sheetId: string) => Promise<ResponseMessage>*

If you want to navigate from one sheet to another programmatically, with the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.setSelectedSheetId('<YOUR_SHEET_ID>');
```

#### 🔹 getSheets *() => Promise<Sheet[]>*

If you want to get the current set of sheets, from Amazon QuickSight dashboard in ad-hoc manner, use the below method:

```typescript
    const sheets: Sheet[] = await embeddedDashboardExperience.getSheets();
```

#### 🔹 getSelectedSheetId *() => Promise<string>*

If you want to get the current sheet id, from Amazon QuickSight dashboard in ad-hoc manner, use the below method:

```typescript
    const selectedSheetId: string = await embeddedDashboardExperience.getSelectedSheetId();
```

#### 🔹 initiatePrint *() => Promise<ResponseMessage>*

This feature allows you to initiate dashboard print, from parent website, without a navbar print icon, in the dashboard. To initiate a dashboard print from parent website, use dashboard.initiatePrint(), for example:
```javascript
    embeddedDashboardExperience.initiatePrint();
```

#### 🔹 getParameters *() => Promise<Parameter[]>*

If you want to get the active parameter values, from Amazon QuickSight dashboard in ad-hoc manner, use the below method:

```typescript
    const parameters: Parameter[] = await embeddedDashboardExperience.getParameters();
```

#### 🔹 undo *() => Promise<ResponseMessage>*

If you want to unto the changes, use the below method:

```javascript
    embeddedDashboardExperience.undo();
```

#### 🔹 redo *() => Promise<ResponseMessage>*

If you want to redo the changes, use the below method:

```javascript
    embeddedDashboardExperience.redo();
```

#### 🔹 reset *() => Promise<ResponseMessage>*

If you want to reset the changes, use the below method:

```javascript
    embeddedDashboardExperience.reset();
```
***

&nbsp;  
## Visual Embedding
&nbsp;  

Visual Embedding provides an interactive read-only experience.

For more information, see  [Embedding Amazon QuickSight Visuals](https://docs.aws.amazon.com/console/quicksight/visual-embedding) in the Amazon QuickSight User Guide.

&nbsp;  
### Getting Started
&nbsp;  

Use `embedVisual` method to embed a QuickSight dashboard. It returns a promise of `VisualFrame` type.

```typescript
export type SetParameters = (setParametersOptions: SetParametersOptions) => void;
export type Reset = () => void;

export interface VisualFrame extends BaseFrame {
    setParameters: SetParameters;
    reset: Reset;
}

export type Send = (eventName: MessageEventName, message?: any) => void;

export interface BaseFrame {
    send: Send;
}

```

&nbsp;  
### Example
&nbsp;  

```html
<!DOCTYPE html>
<html>

    <head>
        <title>Visual Embedding Example</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@2.0.3/dist/quicksight-embedding-js-sdk.min.js"></script>
        <script type="text/javascript">
            const embedVisual = async() => {    
                const {
                    createEmbeddingContext,
                } = QuickSightEmbedding;

                const embeddingContext = await createEmbeddingContext({
                    onChange: (changeEvent, metadata) => {
                        console.log('Context received a change', changeEvent, metadata);
                    },
                });

                const frameOptions = {
                    url: "<YOUR_EMBED_URL>", // replace this value with the url generated via embedding API
                    container: '#experience-container',
                    height: "700px",
                    width: "1000px",
                    onChange: (changeEvent, metadata) => {
                        switch (changeEvent.eventName) {
                            case 'FRAME_MOUNTED': {
                                console.log("Do something when the experience frame is mounted.");
                                break;
                            }
                            case 'FRAME_LOADED': {
                                console.log("Do something when the experience frame is loaded.");
                                break;
                            }
                        }
                    },
                };

                const contentOptions = {
                    parameters: [
                        {
                            Name: 'country',
                            Values: ['United States'],
                        },
                        {
                            Name: 'states',
                            Values: [
                                'California',
                                'Washington'
                            ]
                        }
                    ],
                    locale: "en-US",
                    onMessage: async (messageEvent, experienceMetadata) => {
                        switch (messageEvent.eventName) {
                            case 'CONTENT_LOADED': {
                                console.log("All visuals are loaded. The title of the document:", messageEvent.message.title);
                                break;
                            }
                            case 'ERROR_OCCURRED': {
                                console.log("Error occured while rendering the experience. Error code:", messageEvent.message.errorCode);
                                break;
                            }
                            case 'PARAMETERS_CHANGED': {
                                console.log("Parameters changed. Changed parameters:", messageEvent.message.changedParameters);
                                break;
                            }
                            case 'SIZE_CHANGED': {
                                console.log("Size changed. New dimensions:", messageEvent.message);
                                break;
                            }
                        }
                    },
                };
                const embeddedVisualExperience = await embeddingContext.embedVisual(frameOptions, contentOptions);

                const selectCountryElement = document.getElementById('country');
                selectCountryElement.addEventListener('change', (event) => {
                    embeddedVisualExperience.setParameters([
                        {
                            Name: 'country',
                            Values: event.target.value
                        }
                    ]);
                });
            };
        </script>
    </head>

    <body onload="embedVisual()">
        <span>
            <label for="country">Country</label>
            <select id="country" name="country">
                <option value="United States">United States</option>
                <option value="Mexico">Mexico</option>
                <option value="Canada">Canada</option>
            </select>
        </span>
        <div id="experience-container"></div>
    </body>

</html>
```

&nbsp;  
### `frameOptions`
&nbsp; 

See [Common Properties of `frameOptions` for All Embedding Experiences](#common-properties-of-frameoptions-for-all-embedding-experiences) for `url`, `container`, `width`, `height`, `className`, `withIframePlaceholder`, `onChange` properties

&nbsp;  
#### resizeHeightOnSizeChangedEvent: *boolean* *(optional, default: false)*

Use `resizeHeightOnSizeChangedEvent` to allow changing the iframe height when the height of the embedded content changed.
```javascript
    height: "300px",
    resizeHeightOnSizeChangedEvent: true
```

When the `resizeHeightOnSizeChangedEvent` property is set to true, the value of the `height` property acts as a loading height.

&nbsp;  
### `contentOptions`
&nbsp;  

See [Common Properties of `contentOptions` for All Embedding Experiences](#common-properties-of-contentoptions-for-all-embedding-experiences) for `locale` and `parameters` properties

#### 🔹 fitToIframeWidth: *boolean* *(optional, default=true)*

If this is set to `false`, the visual keeps its dimensions as it was designed within its dashboard layout. Otherwise, it adjusts its width to match the iframe's width, while maintaining the original aspect ratio.

The observed behavior of the fitToIframeWidth property varies depending on the layout setting of the underlying dashboard that the visual is a part of:

In Tiled and Free-form layouts, the width is fixed. When the fitToIframeWidth property is toggled, the width changes between fixed width and full iframe width.

In Classic layout, the width is responsive. Since the visual already fits to the width of the iframe, it remains full iframe width even when the fitToIframeWidth property is set to false.

#### 🔹 onMessage: *SimpleMessageEventHandler* *(optional)*

The `eventName`s the dashboard experience receive

    CONTENT_LOADED: Received when the visuals of the Amazon QuickSight dashboard are fully loaded
    ERROR_OCCURRED: Received when an error occurred while rendering the Amazon QuickSight visual. The message contains `errorCode`. The error codes are:
    - `Forbidden` -- the URL's authentication code expired
    - `Unauthorized` -- the session obtained from the authentication code expired
    If you follow the instructions to generate the correct URL, but you still receive these error codes, you need to generate a new URL.
    PARAMETERS_CHANGED: Received when the parameters in Amazon QuickSight dashboard changes.
    SIZE_CHANGED: Received when the size of the Amazon QuickSight dashboard changes.

&nbsp;  
### Actions
&nbsp;  

#### 🔹 setParameters: *(parameters: Parameter[]) => Promise<ResponseMessage>;*

Use this function to update parameter values. Pass an array as value for multi-value parameters.
You can build your own UI to trigger this, so that viewers of the embedded QuickSight session can control it from your app page.

Parameters in an embedded experience session can be set by using the following call:
```javascript
    embeddedExperience.setParameters([
        {
            Name: 'country',
            Values: ['United States'],
        },
        {
            Name: 'states'
            Values: ['California', 'Washington'],
        }
    ]);
```

To reset a parameter so that it includes all values, you can pass the string `ALL_VALUES`.
```javascript
    embeddedExperience.setParameters([
        {
            Name: 'states'
            Values: ['ALL_VALUES'],
        }
    ]);
```

#### 🔹 reset *() => Promise<ResponseMessage>*

If you want to reset the changes, use the below method:

```javascript
    embeddedDashboardExperience.reset();
```

***

&nbsp;  
## Console Embedding
&nbsp;  

Console embedding provides the QuickSight authoring experience.

  For more information, see [Embedding the Amazon QuickSight Console](https://docs.aws.amazon.com/quicksight/latest/user/embedded-analytics-full-console-for-authenticated-users.html)

  Embedded authoring experience allows the user to create QuickSight assets, just like they can in the AWS console for QuickSight. Exactly what the user can do in the console is controlled by a custom permission profile. The profile can remove abilities such as creating or updating data sources and datasets. You can set also the default visual type. Embedded consoles currently don't support screen scaling in formatting options.

&nbsp;  
### Getting Started
&nbsp;  

Use `embedConsole` method to embed a QuickSight dashboard. It returns a promise of `ConsoleFrame` type.


```typescript
export type Send = (eventName: MessageEventName, message?: any) => void;

export interface BaseFrame {
    send: Send;
}
```

&nbsp;  
### Example
&nbsp;  

```html
<!DOCTYPE html>
<html>

    <head>
        <title>Console Embedding Example</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@2.0.3/dist/quicksight-embedding-js-sdk.min.js"></script>
        <script type="text/javascript">
            const embedConsole = async() => {
                const {
                    createEmbeddingContext,
                } = QuickSightEmbedding;

                const embeddingContext = await createEmbeddingContext({
                    onChange: (changeEvent, metadata) => {
                        console.log('Context received a change', changeEvent, metadata);
                    },
                });

                const frameOptions = {
                    url: "<YOUR_EMBED_URL>", // replace this value with the url generated via embedding API
                    container: '#experience-container',
                    height: "700px",
                    width: "1000px",
                    onChange: (changeEvent, metadata) => {
                        switch (changeEvent.eventName) {
                            case 'FRAME_MOUNTED': {
                                console.log("Do something when the experience frame is mounted.");
                                break;
                            }
                            case 'FRAME_LOADED': {
                                console.log("Do something when the experience frame is loaded.");
                                break;
                            }
                        }
                    },
                };

                const contentOptions = {
                    onMessage: async (messageEvent, experienceMetadata) => {
                        switch (messageEvent.eventName) {
                            case 'ERROR_OCCURRED': {
                                console.log("Do something when the embedded experience fails loading.");
                                break;
                            }
                        }
                    }
                };
                const embeddedConsoleExperience = await embeddingContext.embedConsole(frameOptions, contentOptions);
            };
        </script>
    </head>

    <body onload="embedConsole()">
        <div id="experience-container"></div>
    </body>

</html>
```

&nbsp;  
### `frameOptions`
&nbsp; 

See [Common Properties of `frameOptions` for All Embedding Experiences](#common-properties-of-frameoptions-for-all-embedding-experiences) for `url`, `container`, `width`, `height`, `className`, `withIframePlaceholder`, `onChange` properties

&nbsp;  
### `contentOptions`
&nbsp;  

See [Common Properties of `contentOptions` for All Embedding Experiences](#common-properties-of-contentoptions-for-all-embedding-experiences) for `locale` property

#### 🔹 onMessage: *SimpleMessageEventHandler* *(optional)*

The `eventName`s the dashboard experience receive

    ERROR_OCCURRED: Received when an error occurred while rendering the Amazon QuickSight visual. The message contains `errorCode`. The error codes are:
    - `Forbidden` -- the URL's authentication code expired
    - `Unauthorized` -- the session obtained from the authentication code expired
    If you follow the instructions to generate the correct URL, but you still receive these error codes, you need to generate a new URL.

***

&nbsp;  
## QSearchBar Embedding
&nbsp;  

QSearchBar Embedding provides the [QuickSight Q](https://aws.amazon.com/quicksight/q/) search bar experience.

For more information, see  [Embedding Amazon QuickSight Q Search Bar](https://docs.aws.amazon.com/quicksight/latest/user/embedded-analytics-q-search-bar-for-authenticated-users.html) in the Amazon QuickSight User Guide.

&nbsp;  
### Getting Started
&nbsp;  

Use `embedQSearchBar` method to embed a QuickSight dashboard. It returns a promise of `QSearchFrame` type.

```typescript
export type SetQuestion = (question: string) => void;
export type Close = () => void;

export interface QSearchFrame extends BaseFrame {
    setQuestion: SetQuestion;
    close: Close;
}

export type Send = (eventName: MessageEventName, message?: any) => void;

export interface BaseFrame {
    send: Send;
}

```

&nbsp;  
### Example
&nbsp;  

```html
<!DOCTYPE html>
<html>

    <head>
        <title>Q Search Bar Embedding Example</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@2.0.3/dist/quicksight-embedding-js-sdk.min.js"></script>
        <script type="text/javascript">
            const embedQSearchBar = async() => {    
                const {
                    createEmbeddingContext,
                } = QuickSightEmbedding;

                const embeddingContext = await createEmbeddingContext({
                    onChange: (changeEvent, metadata) => {
                        console.log('Context received a change', changeEvent, metadata);
                    },
                });

                const frameOptions = {
                    url: "<YOUR_EMBED_URL>", // replace this value with the url generated via embedding API
                    container: '#experience-container',
                    height: "700px",
                    width: "1000px",
                    onChange: (changeEvent, metadata) => {
                        switch (changeEvent.eventName) {
                            case 'FRAME_MOUNTED': {
                                console.log("Do something when the experience frame is mounted.");
                                break;
                            }
                            case 'FRAME_LOADED': {
                                console.log("Do something when the experience frame is loaded.");
                                break;
                            }
                        }
                    },
                };

                const contentOptions = {
                    hideTopicName: false, 
                    theme: '<YOUR_THEME_ID>',
                    allowTopicSelection: true,
                    onMessage: async (messageEvent, experienceMetadata) => {
                        switch (messageEvent.eventName) {
                            case 'Q_SEARCH_OPENED': {
                                console.log("Do something when Q Search content expanded");
                                break;
                            }
                            case 'Q_SEARCH_CLOSED': {
                                console.log("Do something when Q Search content collapsed");
                                break;
                            }
                            case 'Q_SEARCH_SIZE_CHANGED': {
                                console.log("Do something when Q Search size changed");
                                break;
                            }
                            case 'CONTENT_LOADED': {
                                console.log("Do something when the Q Search is loaded.");
                                break;
                            }
                            case 'ERROR_OCCURRED': {
                                console.log("Do something when the Q Search fails loading.");
                                break;
                            }
                        }
                    }
                };
                const embeddedQSearchBarExperience = await embeddingContext.embedQSearchBar(frameOptions, contentOptions);
            };
        </script>
    </head>

    <body onload="embedQSearchBar()">
        <div id="experience-container"></div>
    </body>

</html>
```

&nbsp;  
### `frameOptions`
&nbsp; 

See [Common Properties of `frameOptions` for All Embedding Experiences](#common-properties-of-frameoptions-for-all-embedding-experiences) for `url`, `container`, `width`, `height`, `className`, `withIframePlaceholder`, `onChange` properties

Note for Q search bar embedding, you'll likely want to use `className` to give the iframe a `position: absolute` so that when expanded it does not shift the contents of your application. If elements in your application are appearing in front of the Q search bar, you can provide the iframe with a higher z-index as well.

&nbsp;  
### `contentOptions`
&nbsp;  

#### 🔹 hideTopicName: *boolean* *(optional, default=false)*
The `hideTopicName` property can be used to customize whether or not the QuickSight Q Topic name appears in the embedded search bar.

#### 🔹 theme: *string* *(optional)*
The `theme` property can be used to set a content theme for the embedded search bar. Note that the embedded QuickSight user, or the group or namespace they belong to, must have permissions on this theme. The default theme is the default QuickSight theme seen in the console application.

#### 🔹 allowTopicSelection: *boolean* *(optional)*
The `allowTopicSelection` property can be used to customize whether or not the embedded user can change the selected topic for the Q search bar. Note that this can only be set to false if the `initialTopicId` was specified in the embedding API; for more information, see [QuickSight Embedding APIs](https://docs.aws.amazon.com/en_us/quicksight/latest/APIReference/embedding-quicksight.html). The default value is `true`.

#### 🔹 onMessage: *SimpleMessageEventHandler* *(optional)*

The `eventName`s the dashboard experience receive

    Q_SEARCH_CLOSED: Received when the Q search collapsed
    Q_SEARCH_OPENED: Received when the Q search expanded
    Q_SEARCH_SIZE_CHANGED: Received when the size of the Q search changed

&nbsp;  
### Actions
&nbsp;  

#### 🔹 setQuestion

This feature sends a question to the Q search bar and immediately queries the question. It also automatically opens the Q popover.

```javascript
    embeddedQBarExperience.setQuestion('show me monthly revenue');
```

#### 🔹 close

This feature closes the Q popover, returns the iframe to the original Q search bar size.

```javascript
    embeddedQBarExperience.close();
```

***

&nbsp;  
## Troubleshooting
&nbsp;  
1. Make sure the URL you provide in options is not encoded. You should avoid using an encoded URL because it breaks the authcode in the URL by changing it. Also, check that the URL sent in the response from the server side is not encoded.
2. The URL only works if it used with the authcode it came with. The URL and authcode need to be used together. They expire after five minutes, so it's worth checking that you're not troubleshooting an expired combination of URL and authcode.
2. Some browsers (e.g. mobile safari) have default setting to "Always Block Cookies". Change the setting to either "Allow form Websites I Visit" or "Always Allow".
3. Q search bar troubleshooting:
    * Shifting page contents in unwanted way - try giving the embedding container and the iframe class a style with position absolute.
    * Clicking on some parts of your application does not close the Q search bar - listen to the `Q_SEARCH_OPENED` and `Q_SEARCH_CLOSED` messages to create a backdrop/element on the page that's always clickable so that the document listener can properly close the search bar.


&nbsp;  
## License
&nbsp;  
Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
