# Amazon QuickSight Embedding SDK
&nbsp;  
Thank you for using the Amazon QuickSight JavaScript SDK. You can use this SDK to embed Amazon QuickSight in your HTML.

Amazon QuickSight offers four different embedding experiences with options for user isolation with namespaces, and custom UI permissions.

* [Dashboard Embedding](#dashboard-embedding)
* [Visual Embedding](#visual-embedding)
* [Console Embedding](#console-embedding)
* [QSearchBar Embedding](#qsearchbar-embedding)
* [Generative Q&A Embedding](#generative-qa-embedding)
* [Quick Chat Embedding](#quick-chat-embedding)

&nbsp;  
## Installation
&nbsp;

**Option 1:** Use the Amazon QuickSight Embedding SDK in the browser:
```html
...
<script src="https://unpkg.com/amazon-quicksight-embedding-sdk@2.11.3/dist/quicksight-embedding-js-sdk.min.js"></script>
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

export type CreateEmbeddingContext = (frameOptions?: EmbeddingContextFrameOptions) => Promise<EmbeddingContext>

export type EventListener = (
        event: EmbeddingEvents,
        metadata?: ExperienceFrameMetadata
) => void;

export type EmbeddingContextFrameOptions = {
   onChange?: EventListener;
};

export type IEmbeddingContext = {
   embedDashboard: (frameOptions: FrameOptions, contentOptions?: DashboardContentOptions) => Promise<DashboardExperience>;
   embedVisual: (frameOptions: FrameOptions, contentOptions?: VisualContentOptions) => Promise<VisualExperience>;
   embedConsole: (frameOptions: FrameOptions, contentOptions?: ConsoleContentOptions) => Promise<ConsoleExperience>;
   embedQSearchBar: (frameOptions: FrameOptions, contentOptions?: QSearchContentOptions) => Promise<QSearchExperience>;
   embedGenerativeQnA: (frameOptions: FrameOptions, contentOptions?: GenerativeQnAContentOptions) => Promise<GenerativeQnAContentOptions>;
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

An `EmbeddingContext` instance exposes 6 experience methods

* embedDashboard
* embedVisual
* embedConsole
* embedQSearchBar
* embedGenerativeQnA
* embedQuickChat

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

// Embedding a Quick Chat experience
const embeddedQuickChatExperience = await embedQuickChat(frameOptions, contentOptions);

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
    const option = { className: "your-own-class" }
```

We've overridden the border and padding of the iframe to be 0px, because setting border and padding on the iframe might cause unexpected issues. If you have to set border and padding on the embedded QuickSight session, set it on the container div that contains the iframe.

#### 🔹 withIframePlaceholder: *boolean* *(optional, default=false)*

It renders a simple spinner in the embedded experience container while the contents of the embedding experience iframe is being loaded.

#### 🔹 onChange: *EventListener* *(optional)*

This callback is invoked when there is a change in the SDK code status.

```
export type EventListener = (event: EmbeddingEvents, metadata?: ExperienceFrameMetadata) => void;

export interface ChangeEvent {
    eventName: EventName,
    eventLevel: ChangeEventLevel,
    message?: EventMessageValue,
    data?: EventData
}

export type ExperienceFrameMetadata = {
    frame: EmbeddingIFrameElement | null;
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
    FRAME_REMOVED: invoked after iframe element is removed from the DOM

`WarnChangeEventName`s

    UNRECOGNIZED_CONTENT_OPTIONS: invoked when the content options for the experience contain unrecognized properties
    UNRECOGNIZED_FRAME_OPTIONS: invoked when the frame options for the experience contain unrecognized properties
    UNRECOGNIZED_EVENT_TARGET: invoked when a message with unrecognized event target is received


```javascript
const frameOptions = {
    //...
    onChange: (changeEvent: EmbeddingEvents, metadata: ExperienceFrameMetadata) => {
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
            case 'FRAME_REMOVED': {
                console.log("Do something when the experience frame is removed.");
                break;
            }
            //...
        }
    },
};
```

#### 🔹 framePermissions: *(optional)*
The `framePermissions` property can be used to customize the iframe allow permissions.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 clipboardRead: *boolean* *(optional)*
This determines whether the iframe will have permissions to read from the clipboard.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 clipboardWrite: *boolean* *(optional)*
This determines whether the iframe will have permissions to write to the clipboard.

&nbsp;  
### Common Properties of `contentOptions` for All Embedding Experiences
&nbsp;  


#### 🔹 locale: *string* *(optional)* (not available in QSearchBar embedding)

You can set locale for the embedded QuickSight session:
```javascript
    const option = { locale: "en-US" }; 
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


#### 🔹 onMessage: *EventListener* *(optional)*

You can add `onMessage` callback into the `contentOptions` of all embedding experiences. 

```typescript
export type EventListener = (event: EmbeddingEvents, metadata?: ExperienceFrameMetadata) => void;

export interface SimpleMessageEvent {
   eventName: EventName;
   message?: EventMessageValue;
   data?: EventData;
   eventTarget?: InternalExperiences;
}

export type ExperienceFrameMetadata = {
    frame: EmbeddingIFrameElement | null;
};

```

See the experience specific documentation below for the supported `eventName`s for each experience type. 

```typescript

const contentOptions = {
    //...
    onMessage: async (messageEvent: EmbeddingEvents, metadata?: ExperienceFrameMetadata) => {
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

Use `embedDashboard` method to embed a QuickSight dashboard. It returns a promise of `DashboardExperience` type.

```typescript
export class DashboardExperience extends BaseExperience<DashboardContentOptions, InternalDashboardExperience, IDashboardExperience, TransformedDashboardContentOptions, DashboardExperienceFrame> {
   initiatePrint: () => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   undo: () => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   redo: () => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   toggleBookmarksPane: () => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   toggleThresholdAlertsPane: () => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   toggleSchedulingPane: () => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   toggleRecentSnapshotsPane: () => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   getParameters: () => Promise<Parameter[]>;
   getSheets: () => Promise<Sheet[]>;
   getVisualActions: (sheetId: string, visualId: string) => Promise<VisualAction[]>;
   addVisualActions: (sheetId: string, visualId: string, actions: VisualAction[]) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   setVisualActions: (sheetId: string, visualId: string, actions: VisualAction[]) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   getFilterGroupsForSheet: (sheetId: string) => Promise<FilterGroup[]>;
   getFilterGroupsForVisual: (sheetId: string, visualId: string) => Promise<FilterGroup[]>;
   addFilterGroups: (filterGroups: FilterGroup[]) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   updateFilterGroups: (filterGroups: FilterGroup[]) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   removeFilterGroups: (filterGroupsOrIds: FilterGroup[] | string[]) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   setTheme:(themeArn: string) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   setThemeOverride: (themeOverride: ThemeConfiguration) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   createSharedView: () => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   getSelectedSheetId: () => Promise<string>;
   setSelectedSheetId: (sheetId: string) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   navigateToDashboard: (dashboardId: string, navigateToDashboardOptions?: NavigateToDashboardOptions) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   removeVisualActions: (sheetId: string, visualId: string, actions: VisualAction[]) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   getSheetVisuals: (sheetId: string) => Promise<Visual[]>;
   setParameters: (parameters: Parameter[]) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   reset: () => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   send: <EventMessageValue extends EventMessageValues>(messageEvent: EmbeddingMessageEvent<MessageEventName>) => Promise<ResponseMessage<EventMessageValue>>;
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
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@2.11.3/dist/quicksight-embedding-js-sdk.min.js"></script>
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

See [Common Properties of `frameOptions` for All Embedding Experiences](#common-properties-of-frameoptions-for-all-embedding-experiences) for `url`, `container`, `width`, `height`, `className`, `withIframePlaceholder`, `onChange`, `framePermissions`, properties

&nbsp;  
#### resizeHeightOnSizeChangedEvent: *boolean* *(optional, default: false)*

Use `resizeHeightOnSizeChangedEvent` to allow changing the iframe height when the height of the embedded content changed.
```json
    {
        "height": "300px",
        "resizeHeightOnSizeChangedEvent": true
}
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

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 bookmarks: *boolean* *(optional, default=false)*
This can be used to show or hide the bookmarks button for dashboard embedding.

The bookmarks feature is only available for the embedded dashboards of which embed URL is obtained using `generateEmbedUrlForRegisteredUser` which enables `Bookmarks` feature in the `FeatureConfigurations` property.

```
...
"ExperienceConfiguration": {
    "Dashboard": {
        "InitialDashboardId": "<YOUR_DASHBOARD_ID>",
        "FeatureConfigurations": {
            "Bookmarks": {
                "Enabled": true
            }
        }
    }
}
...
```

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 thresholdAlerts: *boolean* *(optional, default=false)*
This can be used to show or hide the threshold alerts button for dashboard embedding.

The thresholdAlerts feature is only available for embedded dashboards generated using `generateEmbedUrlForRegisteredUser` with `ThresholdAlerts` feature enabled in the `FeatureConfigurations` property.

```
...
"ExperienceConfiguration": {
    "Dashboard": {
        "InitialDashboardId": "<YOUR_DASHBOARD_ID>",
        "FeatureConfigurations": {
            "ThresholdAlerts": {
                "Enabled": true
            }
        }
    }
}
...
```

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 scheduling: *boolean* *(optional, default=false)*
This can be used to show or hide the schedules button for dashboard embedding.

The scheduling feature is only available for embedded dashboards generated using `generateEmbedUrlForRegisteredUser` with `Schedules` feature enabled in the `FeatureConfigurations` property.

```
...
"ExperienceConfiguration": {
    "Dashboard": {
        "InitialDashboardId": "<YOUR_DASHBOARD_ID>",
        "FeatureConfigurations": {
            "Schedules": {
                "Enabled": true
            }
        }
    }
}
...
```

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 recentSnapshots: *boolean* *(optional, default=false)*
This can be used to show or hide the recent snapshots button for dashboard embedding.

The recentSnapshots feature is only available for embedded dashboards generated using `generateEmbedUrlForRegisteredUser` with `RecentSnapshots` feature enabled in the `FeatureConfigurations` property.

```
...
"ExperienceConfiguration": {
    "Dashboard": {
        "InitialDashboardId": "<YOUR_DASHBOARD_ID>",
        "FeatureConfigurations": {
            "RecentSnapshots": {
                "Enabled": true
            }
        }
    }
}
...
```

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 executiveSummary: *boolean* *(optional, default=false)*
This can be used to enable executive summaries as the instant generation of insights from dashboards.

This option is available for both embedded console and embedded dashboard.
To use, calling `generateEmbedUrlForRegisteredUser` or `generateEmbedUrlForRegisteredUserWithIdentity`.
For Console Embedding, make sure you enable all the features in the same request, as granular control is not supported currently.

```
...
"ExperienceConfiguration": {
    "QuickSightConsole": {
        "InitialPath": "<INITIAL_PATH>",
        "FeatureConfigurations": {
            "AmazonQInQuickSight": {
                "DataQnA": {
                    "Enabled": true
                },
                "DataStories": {
                    "Enabled": true
                },
                "ExecutiveSummary": {
                    "Enabled": true
                },
                "GenerativeAuthoring": {
                    "Enabled": true
                }
            }
        }
    }
}
...
```
or
```
...
"ExperienceConfiguration": {
    "Dashboard": {
        "InitialDashboardId": "<YOUR_DASHBOARD_ID>",
        "FeatureConfigurations": {
            "AmazonQInQuickSight": {
                "ExecutiveSummary": {
                    "Enabled": true
                }
            }
        }
    }
}
...
```

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 dataQnA: *boolean* *(optional, default=false)*
This can be used to enable multi-visual Q&A in console embedding.

This option is only available for embedded console.
To use, calling `generateEmbedUrlForRegisteredUser` or `generateEmbedUrlForRegisteredUserWithIdentity`.
For Console Embedding, make sure you enable all the features in the same request, as granular control is not supported currently.

```
...
"ExperienceConfiguration": {
    "QuickSightConsole": {
        "InitialPath": "<INITIAL_PATH>",
        "FeatureConfigurations": {
            "AmazonQInQuickSight": {
                "DataQnA": {
                    "Enabled": true
                },
                "DataStories": {
                    "Enabled": true
                },
                "ExecutiveSummary": {
                    "Enabled": true
                },
                "GenerativeAuthoring": {
                    "Enabled": true
                }
            }
        }
    }
}
...
```

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 buildVisual: *boolean* *(optional, default=false)*
This can be used to enable building visuals with the natural language query for authors in console embedding.

This option is only available for embedded console.
To use, calling `generateEmbedUrlForRegisteredUser` or `generateEmbedUrlForRegisteredUserWithIdentity`.
For Console Embedding, make sure you enable all the features in the same request, as granular control is not supported currently.

```
...
"ExperienceConfiguration": {
    "QuickSightConsole": {
        "InitialPath": "<INITIAL_PATH>",
        "FeatureConfigurations": {
            "AmazonQInQuickSight": {
                "DataQnA": {
                    "Enabled": true
                },
                "DataStories": {
                    "Enabled": true
                },
                "ExecutiveSummary": {
                    "Enabled": true
                },
                "GenerativeAuthoring": {
                    "Enabled": true
                }
            }
        }
    }
}
...
```

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 buildStory: *boolean* *(optional, default=false)*
This can be used to enable building stories from dashboards in console embedding.

This option is only available for embedded console.
To use, calling `generateEmbedUrlForRegisteredUser` or `generateEmbedUrlForRegisteredUserWithIdentity`.
For Console Embedding, make sure you enable all the features in the same request, as granular control is not supported currently.

```
...
"ExperienceConfiguration": {
    "QuickSightConsole": {
        "InitialPath": "<INITIAL_PATH>",
        "FeatureConfigurations": {
            "AmazonQInQuickSight": {
                "DataQnA": {
                    "Enabled": true
                },
                "DataStories": {
                    "Enabled": true
                },
                "ExecutiveSummary": {
                    "Enabled": true
                },
                "GenerativeAuthoring": {
                    "Enabled": true
                }
            }
        }
    }
}
...
```


#### 🔹 sheetOptions

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 initialSheetId: *string* *(optional)*
You can use this when you want to specify the initial sheet of the dashboard, instead of loading the first sheet of the embedded dashboard. You can provide the target sheet id of the dashboard as the value. In case the sheet id value is invalid, the first sheet of the dashboard will be loaded.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 singleSheet: *boolean* *(optional, default=false)*
The `singleSheet` property can be used to enable or disable sheet tab controls in dashboard embedding.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 emitSizeChangedEventOnSheetChange: *boolean* (optional default=false)
You can use this in combination with `resizeHeightOnSizeChangedEvent: true` frame option, when you want the embedded dashboard height to auto resize based on sheet height, on every sheet change event.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 fitSheetToWidth: *boolean* (optional default=true)
Using this option, you can change how the sheet content behaves when it comes to whether to auto-fit sheet container size.
It is set to true by default for the sheet content to automatically adjust to the container's resizing.
This option is intended to simulate the "Fit to window" feature in the native Quick Suite, thereby enabling users of the embedding JS SDK to customize the resizing behavior of the sheet content.

#### 🔹 attributionOptions

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 overlayContent: *boolean* *(optional, default=false)*

We add 22 pixels of additional height at the bottom of the layout to provide dedicated space to the "Powered by QuickSight" footer.
You can set this property to `true` to overlay it with your content.

#### 🔹 onMessage: *EventListener* *(optional)*

The `eventName`s the dashboard experience receives

    CONTENT_LOADED: Received when the visuals of the Amazon QuickSight dashboard are fully loaded
    ERROR_OCCURRED: Received when an error occurred while rendering the visuals of the Amazon QuickSight dashboard. The message contains `errorCode`. The error codes are:
    - `Forbidden` -- the URL's authentication code expired
    - `Unauthorized` -- the session obtained from the authentication code expired
    If you follow the instructions to generate the correct URL, but you still receive these error codes, you need to generate a new URL.
    PARAMETERS_CHANGED: Received when the parameters in Amazon QuickSight dashboard changes.
    PARAMETERS_LOADED: Emitted once per dashboard when its parameters have finished loading. 
    - This event fires during the initial dashboard load and subsequently whenever navigateToDashboard() transitions to a new dashboard.
    SELECTED_SHEET_CHANGED: Received when the selected sheet in Amazon QuickSight dashboard changes.
    SIZE_CHANGED: Received when the size of the Amazon QuickSight dashboard changes.
    MODAL_OPENED: Received when a modal opened in Amazon QuickSight dashboard.

&nbsp;  
### Actions
&nbsp;  

#### 🔹 setParameters: *(parameters: Parameter[]) => Promise&lt;ResponseMessage&gt;;*

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
            Name: 'states',
            Values: ['California', 'Washington'],
        }
    ]);
```

To reset a parameter so that it includes all values, you can pass the string `ALL_VALUES`.
```javascript
    embeddedExperience.setParameters([
        {
            Name: 'states',
            Values: ['ALL_VALUES'],
        }
    ]);
```

#### 🔹 navigateToDashboard *(dashboardId: string, options?: NavigateToDashboardOptions) => Promise&lt;ResponseMessage&gt;*

To navigate to a different dashboard, use dashboard.navigateToDashboard(options). The input parameter options should contain the dashboardId that you want to navigate to, and also the parameters for that dashboard, for example:
```javascript
    const dashboardId: "37a99f75-8230-4409-ac52-e45c652cc21e";
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

#### 🔹 setSelectedSheetId *(sheetId: string) => Promise&lt;ResponseMessage&gt;*

If you want to navigate from one sheet to another programmatically, with the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.setSelectedSheetId('<YOUR_SHEET_ID>');
```

#### 🔹 getSheets *() => Promise<Sheet[]>*

If you want to get the current set of sheets, from Amazon QuickSight dashboard in ad-hoc manner, use the below method:

```typescript
    const sheets: Sheet[] = await embeddedDashboardExperience.getSheets();
```

#### 🔹 getSelectedSheetId *() => Promise&lt;string&gt;*

If you want to get the current sheet id, from Amazon QuickSight dashboard in ad-hoc manner, use the below method:

```typescript
    const selectedSheetId: string = await embeddedDashboardExperience.getSelectedSheetId();
```

#### 🔹 getSheetVisuals *(sheetId: string) => Promise&lt;Visual[]&gt;*

If you want to get the list of the visuals of a sheet from the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.getSheetVisuals('<YOUR_SHEET_ID>');
```

#### 🔹 getVisualActions *(sheetId: string, visualId: string) => Promise&lt;VisualAction[]&gt;*

If you want to get the list of actions of a visual from the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.getVisualActions('<YOUR_SHEET_ID>', '<YOUR_VISUAL_ID>');
```

#### 🔹 addVisualActions *(sheetId: string, visualId: string, actions: VisualAction[]) => Promise&lt;ResponseMessage&gt;*

If you want to add actions to a visual of the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.addVisualActions('<YOUR_SHEET_ID>', '<YOUR_VISUAL_ID>', [
        {
            Name: '<NEW_ACTION_NAME>',
            CustomActionId: `<NEW_ACTION_ID>`,
            Status: 'ENABLED',
            Trigger: 'DATA_POINT_CLICK', // or 'DATA_POINT_MENU'
            ActionOperations: [{
                CallbackOperation: {
                    EmbeddingMessage: {}
                }
            }]
        }
    ]);
```

This method appends the new actions provided in the request to the existing actions of the visual

#### 🔹 removeVisualActions *(sheetId: string, visualId: string, actions: VisualAction[]) => Promise&lt;ResponseMessage&gt;*

If you want to remove actions from a visual of the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.removeVisualActions('<YOUR_SHEET_ID>', '<YOUR_VISUAL_ID>', [
        {
            Name: '<EXISTING_ACTION_NAME>',
            CustomActionId: `<EXISTING_ACTION_ID>`,
            Status: 'ENABLED',
            Trigger: 'DATA_POINT_CLICK', // or 'DATA_POINT_MENU'
            ActionOperations: [{
                CallbackOperation: {
                    EmbeddingMessage: {}
                }
            }]
        }
    ]);
```

#### 🔹 setVisualActions *(sheetId: string, visualId: string, actions: VisualAction[]) => Promise&lt;ResponseMessage&gt;*

If you want to set actions of a visual of the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.setVisualActions('<YOUR_SHEET_ID>', '<YOUR_VISUAL_ID>', [
        {
            Name: '<NEW_ACTION_NAME>',
            CustomActionId: `<NEW_ACTION_ID>`,
            Status: 'ENABLED',
            Trigger: 'DATA_POINT_CLICK', // or 'DATA_POINT_MENU'
            ActionOperations: [{
                CallbackOperation: {
                    EmbeddingMessage: {}
                }
            }]
        }
    ]);
```

This method replaces all existing actions of the visual with the new actions provided in the request


#### 🔹 getFilterGroupsForSheet *(sheetId: string) => Promise&lt;FilterGroup[]&gt;*

If you want to get the list of filter groups for a sheet from the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.getFilterGroupsForSheet('<YOUR_SHEET_ID>');
```

#### 🔹 getFilterGroupsForVisual *(sheetId: string, visualId: string) => Promise&lt;FilterGroup[]&gt;*

If you want to get the list of filter groups for a visual from the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.getFilterGroupsForVisual('<YOUR_SHEET_ID>', '<YOUR_VISUAL_ID>');
```

#### 🔹 addFilterGroups *(filterGroups: FilterGroup[]) => Promise&lt;ResponseMessage&gt;*

If you want to add filter groups to the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.addFilterGroups([
        {
            FilterGroupId: '<NEW_FILTER_GROUP_ID>',
            Filters: [
                {
                    CategoryFilter: {
                        Column: {
                            ColumnName: '<YOUR_COLUMN_NAME>',
                            DataSetIdentifier: '<YOUR_DATASET_IDENTIFIER>'
                        },
                        FilterId: '<NEW_FILTER_GROUP_ID>',
                        Configuration: {
                            FilterListConfiguration: {
                                MatchOperator: 'CONTAINS',
                                NullOption: 'NON_NULLS_ONLY',
                                CategoryValues: [
                                    '<A_VALUE_IN_THE_COLUMN>'
                                ]
                            }
                        }
                    }
                }
            ],
            ScopeConfiguration: {
                SelectedSheets: {
                    SheetVisualScopingConfigurations: [
                        {
                            Scope: 'SELECTED_VISUALS',
                            VisualIds: [
                                '<A_VISUAL_ID_IN_DASHBOARD>'
                            ],
                            SheetId: '<YOUR_SHEET_ID>' // Only the selected sheet id is supported
                        }
                    ]
                }
            },
            CrossDataset: 'SINGLE_DATASET',
            Status: 'ENABLED'
        }
    ]);
```

Filter groups can only be added to the currently selected sheet.

#### 🔹 updateFilterGroups *(filterGroups: FilterGroup[]) => Promise&lt;ResponseMessage&gt;*

If you want to update filter groups of the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.updateFilterGroups([
        {
            FilterGroupId: '<EXISTING_FILTER_GROUP_ID>',
            Filters: [
                {
                    NumericEqualityFilter: {
                        Column: {
                            ColumnName: '<YOUR_COLUMN_NAME>',
                            DataSetIdentifier: '<YOUR_DATASET_IDENTIFIER>'
                        },
                        FilterId: '<FILTER_GROUP_ID>',
                        MatchOperator: 'EQUALS',
                        NullOption: 'ALL_VALUES',
                        Value: <SOME_NUMERIC_VALUE_IN_THE_COLUMN>
                    }
                }
            ],
            ScopeConfiguration: {
                SelectedSheets: {
                    SheetVisualScopingConfigurations: [
                        {
                            Scope: 'ALL_VISUALS',
                            SheetId: '<YOUR_SHEET_ID>' // Only the selected sheet id is supported
                        }
                    ]
                }
            },
            CrossDataset: 'SINGLE_DATASET',
            Status: 'ENABLED'
        }
    ]);
```

Only the filter groups of the currently selected sheet can be updated.

#### 🔹 removeFilterGroups *(filterGroups: FilterGroup[]) => Promise&lt;ResponseMessage&gt;*

If you want to remove filter groups of the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.removeFilterGroups([
        '<EXISTING_FILTER_GROUP_ID>',
        // ...
    ]);
```

Only the filter groups of the currently selected sheet can be removed.

#### 🔹 setTheme *(themeArn: string) => Promise&lt;ResponseMessage&gt;*

If you want to set theme for the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.setTheme('<YOUR_THEME_ARN>');
```

Make sure that the user has access to the theme that you want to use. You can make a call to the [ListThemes](https://docs.aws.amazon.com/quicksight/latest/APIReference/API_ListThemes.html) API operation to obtain a list of the themes and theme ARNs that the user has access to.

#### 🔹 setThemeOverride *(themeOverride: ThemeConfiguration) => Promise&lt;ResponseMessage&gt;*

If you want to override the current theme configuration for the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.setThemeOverride({
        UIColorPalette: {
            PrimaryForeground: '#FFCCCC',
            PrimaryBackground: '#555555',
            //...
        },
        // ...
    });
```

#### 🔹 createSharedView *() => Promise&lt;ResponseMessage&gt;*

If you want to share the current view, use the below method: 

```javascript
    embeddedDashboardExperience.createSharedView();
```

#### 🔹 initiatePrint *() => Promise&lt;ResponseMessage&gt;*

This feature allows you to initiate dashboard print, from parent website, without a navbar print icon, in the dashboard. To initiate a dashboard print from parent website, use dashboard.initiatePrint(), for example:
```javascript
    embeddedDashboardExperience.initiatePrint();
```

#### 🔹 getParameters *() => Promise<Parameter[]>*

If you want to get the active parameter values, from Amazon QuickSight dashboard in ad-hoc manner, use the below method:

```typescript
    const parameters: Parameter[] = await embeddedDashboardExperience.getParameters();
```

#### 🔹 undo *() => Promise&lt;ResponseMessage&gt;*

If you want to unto the changes, use the below method:

```javascript
    embeddedDashboardExperience.undo();
```

#### 🔹 redo *() => Promise&lt;ResponseMessage&gt;*

If you want to redo the changes, use the below method:

```javascript
    embeddedDashboardExperience.redo();
```

#### 🔹 reset *() => Promise&lt;ResponseMessage&gt;*

If you want to reset the changes, use the below method:

```javascript
    embeddedDashboardExperience.reset();
```

#### 🔹 toggleBookmarksPane *() => Promise&lt;ResponseMessage&gt;*

If you want to toggle the visibility state of the bookmarks pane, use the below method:

```javascript
    embeddedDashboardExperience.toggleBookmarksPane();
```

#### 🔹 toggleSchedulingPane *() => Promise&lt;ResponseMessage&gt;*

If you want to toggle the visibility state of the scheduling pane, use the below method:

```javascript
    embeddedDashboardExperience.toggleSchedulingPane();
```

#### 🔹 toggleThresholdAlertsPane *() => Promise&lt;ResponseMessage&gt;*

If you want to toggle the visibility state of the thresholdAlerts pane, use the below method:

```javascript
    embeddedDashboardExperience.toggleThresholdAlertsPane();
```

#### 🔹 toggleRecentSnapshotsPane *() => Promise&lt;ResponseMessage&gt;*

If you want to toggle the visibility state of the recentSnapshots pane, use the below method:

```javascript
    embeddedDashboardExperience.toggleRecentSnapshotsPane();
```

#### 🔹 toggleExecutiveSummaryPane *() => Promise&lt;ResponseMessage&gt;*

If you want to toggle the visibility state of the executive summary pane, use the below method:

```javascript
    embeddedDashboardExperience.toggleExecutiveSummaryPane();
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

Use `embedVisual` method to embed a dashboard visual. It returns a promise of `VisualExperience` type.

```typescript
export class VisualExperience extends BaseExperience<VisualContentOptions, InternalVisualExperience, IVisualExperience, TransformedContentOptions, VisualExperienceFrame> {
   setParameters: (parameters: Parameter[]) => Promise<import("@common/events/events").ResponseMessage<import("@common/events/types").EventMessageValues>>;
   reset: () => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   getActions: () => Promise<VisualAction[]>;
   addActions: (actions: VisualAction[]) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   setActions: (actions: VisualAction[]) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   removeActions: (actions: VisualAction[]) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   getFilterGroups: () => Promise<FilterGroup[]>;
   addFilterGroups: (filterGroups: FilterGroup[]) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   updateFilterGroups: (filterGroups: FilterGroup[]) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   removeFilterGroups: (filterGroupsOrIds: FilterGroup[] | string[]) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   setTheme: (themeArn: string) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   setThemeOverride: (themeOverride: ThemeConfiguration) => Promise<SuccessResponseMessage | ErrorResponseMessage>
   send: <EventMessageValue extends EventMessageValues>(messageEvent: EmbeddingMessageEvent<MessageEventName>) => Promise<ResponseMessage<EventMessageValue>>;
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
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@2.11.3/dist/quicksight-embedding-js-sdk.min.js"></script>
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

See [Common Properties of `frameOptions` for All Embedding Experiences](#common-properties-of-frameoptions-for-all-embedding-experiences) for `url`, `container`, `width`, `height`, `className`, `withIframePlaceholder`, `onChange`, `framePermissions` properties

&nbsp;  
#### resizeHeightOnSizeChangedEvent: *boolean* *(optional, default: false)*

Use `resizeHeightOnSizeChangedEvent` to allow changing the iframe height when the height of the embedded content changed.
```json
    {
        "height": "300px",
        "resizeHeightOnSizeChangedEvent": true
    }
```

When the `resizeHeightOnSizeChangedEvent` property is set to true, the value of the `height` property acts as a loading height.

&nbsp;  
### `contentOptions`
&nbsp;  

See [Common Properties of `contentOptions` for All Embedding Experiences](#common-properties-of-contentoptions-for-all-embedding-experiences) for `locale` and `parameters` properties

#### 🔹 parameters: *Parameter[]* *(optional)*

It allows you to set initial parameter values for your embedded QuickSight visual. Pass an array as value for multi-value parameters.
For more information about parameters in Amazon QuickSight, see https://docs.aws.amazon.com/quicksight/latest/user/parameters-in-quicksight.html

#### 🔹 fitToIframeWidth: *boolean* *(optional, default=true)*

If this is set to `false`, the visual keeps its dimensions as it was designed within its dashboard layout. Otherwise, it adjusts its width to match the iframe's width, while maintaining the original aspect ratio.

The observed behavior of the fitToIframeWidth property varies depending on the layout setting of the underlying dashboard that the visual is a part of:

In Tiled and Free-form layouts, the width is fixed. When the fitToIframeWidth property is toggled, the width changes between fixed width and full iframe width.

In Classic layout, the width is responsive. Since the visual already fits to the width of the iframe, it remains full iframe width even when the fitToIframeWidth property is set to false.

#### 🔹 scaleToContainer: *boolean* *(optional, default=false)*
If this is set to `true`, the visual adjusts its width and height automatically to fit the entire viewport within the iframe while the iframe width and height are adjusted.
The resizing doesn't adhere to the original aspect ratio.
This performance will take precedence when both scaleToContainer and fitToIframeWidth are true.

#### 🔹 onMessage: *SimpleMessageEventHandler* *(optional)*

The `eventName`s the visual experience receives

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

#### 🔹 setParameters: *(parameters: Parameter[]) => Promise&lt;ResponseMessage&gt;;*

Use this function to update parameter values. Pass an array as value for multi-value parameters.
You can build your own UI to trigger this, so that viewers of the embedded QuickSight session can control it from your app page.

Parameters in an embedded experience session can be set by using the following call:
```javascript
    embeddedVisualExperience.setParameters([
        {
            Name: 'country',
            Values: ['United States'],
        },
        {
            Name: 'states',
            Values: ['California', 'Washington'],
        }
    ]);
```

To reset a parameter so that it includes all values, you can pass the string `ALL_VALUES`.
```javascript
    embeddedVisualExperience.setParameters([
        {
            Name: 'states',
            Values: ['ALL_VALUES'],
        }
    ]);
```

#### 🔹 getActions *() => Promise&lt;VisualAction[]&gt;*

If you want to get the list of actions of the visual, use the below method:

```javascript
    embeddedVisualExperience.getVisualActions();
```

#### 🔹 addActions *(actions: VisualAction[]) => Promise&lt;ResponseMessage&gt;*

If you want to add actions to the visual, use the below method:

```javascript
    embeddedVisualExperience.addActions([
        {
            Name: '<NEW_ACTION_NAME>',
            CustomActionId: `<NEW_ACTION_ID>`,
            Status: 'ENABLED',
            Trigger: 'DATA_POINT_CLICK', // or 'DATA_POINT_MENU'
            ActionOperations: [{
                CallbackOperation: {
                    EmbeddingMessage: {}
                }
            }]
        }
    ]);
```

This method appends the new actions provided in the request to the existing actions of the visual

#### 🔹 removeActions *(actions: VisualAction[]) => Promise&lt;ResponseMessage&gt;*

If you want to remove actions from the visual, use the below method:

```javascript
    embeddedVisualExperience.removeActions([
        {
            Name: '<EXISTING_ACTION_NAME>',
            CustomActionId: `<EXISTING_ACTION_ID>`,
            Status: 'ENABLED',
            Trigger: 'DATA_POINT_CLICK', // or 'DATA_POINT_MENU'
            ActionOperations: [{
                CallbackOperation: {
                    EmbeddingMessage: {}
                }
            }]
        }
    ]);
```

#### 🔹 setActions *(actions: VisualAction[]) => Promise&lt;ResponseMessage&gt;*

If you want to set actions of the visual, use the below method:

```javascript
    embeddedVisualExperience.setActions([
        {
            Name: '<NEW_ACTION_NAME>',
            CustomActionId: `<NEW_ACTION_ID>`,
            Status: 'ENABLED',
            Trigger: 'DATA_POINT_CLICK', // or 'DATA_POINT_MENU'
            ActionOperations: [{
                CallbackOperation: {
                    EmbeddingMessage: {}
                }
            }]
        }
    ]);
```

This method replaces all existing actions of the visual with the new actions provided in the request

#### 🔹 getFilterGroups *() => Promise&lt;VisualAction[]&gt;*

If you want to get the list of filter groups for the visual, use the below method:

```javascript
    embeddedVisualExperience.getFilterGroups();
```

#### 🔹 addFilterGroups *(filterGroups: FilterGroup[]) => Promise&lt;ResponseMessage&gt;*

If you want to add filter groups to the visual, use the below method:

```javascript
    embeddedVisualExperience.addFilterGroups([
        {
            FilterGroupId: '<NEW_FILTER_GROUP_ID>',
            Filters: [
                {
                    NumericRangeFilter: {
                        Column: {
                            ColumnName: '<YOUR_COLUMN_NAME>',
                            DataSetIdentifier: '<YOUR_DATASET_IDENTIFIER>'
                        },
                        FilterId: '<NEW_FILTER_GROUP_ID>',
                        NullOption: 'ALL_VALUES',
                        IncludeMaximum: true,
                        IncludeMinimum: true,
                        RangeMaximum: {
                            StaticValue: <SOME_NUMERIC_VALUE_IN_THE_COLUMN>
                        },
                        RangeMinimum: {
                            StaticValue: <SOME_NUMERIC_VALUE_IN_THE_COLUMN>
                        }
                    }
                }
            ],
            ScopeConfiguration: {
                SelectedSheets: {
                    SheetVisualScopingConfigurations: [
                        {
                            Scope: 'SELECTED_VISUALS',
                            VisualIds: [
                                '<THE_EMBEDDED_VISUAL_ID>' // Only the embedded visual's id is supported
                            ],
                            SheetId: '<YOUR_SHEET_ID>' // Only the id of the sheet the embedded visual is on is supported
                        }
                    ]
                }
            },
            CrossDataset: 'SINGLE_DATASET',
            Status: 'ENABLED'
        }
    ]);
```

#### 🔹 updateFilterGroups *(filterGroups: FilterGroup[]) => Promise&lt;ResponseMessage&gt;*

If you want to update filter groups of the visual, use the below method:

```javascript
    embeddedVisualExperience.updateFilterGroups([
        {
            FilterGroupId: '<EXISTING_FILTER_GROUP_ID>',
            Filters: [
                {
                    RelativeDatesFilter: {
                        Column: {
                            ColumnName: '<YOUR_COLUMN_NAME>',
                            DataSetIdentifier: '<YOUR_DATASET_IDENTIFIER>'
                        },
                        FilterId: '<FILTER_GROUP_ID>',
                        AnchorDateConfiguration: {
                            AnchorOption: 'NOW'
                        },
                        TimeGranularity: 'YEAR',
                        RelativeDateType: 'LAST',
                        NullOption: 'NON_NULLS_ONLY',
                        MinimumGranularity: 'DAY',
                        RelativeDateValue: 3
                    }
                }
            ],
            ScopeConfiguration: {
                SelectedSheets: {
                    SheetVisualScopingConfigurations: [
                        {
                            Scope: 'SELECTED_VISUALS',
                            VisualIds: [
                                '<THE_EMBEDDED_VISUAL_ID>' // Only the embedded visual's id is supported
                            ],
                            SheetId: '<YOUR_SHEET_ID>' // Only the selected sheet id is supported
                        }
                    ]
                }
            },
            CrossDataset: 'SINGLE_DATASET',
            Status: 'ENABLED'
        }
    ]);
```

#### 🔹 removeFilterGroups *(filterGroups: FilterGroup[]) => Promise&lt;ResponseMessage&gt;*

If you want to remove filter groups from the visual, use the below method:

```javascript
    embeddedVisualExperience.removeFilterGroups([
        '<EXISTING_FILTER_GROUP_ID>',
        // ...
    ]);
```

#### 🔹 setTheme *(themeArn: string) => Promise&lt;ResponseMessage&gt;*

If you want to set theme for the visual, use the below method:

```javascript
    embeddedVisualExperience.setTheme('<YOUR_THEME_ARN>');
```

Make sure that the user has access to the theme that you want to use. You can make a call to the [ListThemes](https://docs.aws.amazon.com/quicksight/latest/APIReference/API_ListThemes.html) API operation to obtain a list of the themes and theme ARNs that the user has access to.

#### 🔹 setThemeOverride *(themeOverride: ThemeConfiguration) => Promise&lt;ResponseMessage&gt;*

If you want to override the current theme configuration for the visual, use the below method:

```javascript
    embeddedVisualExperience.setThemeOverride({
        UIColorPalette: {
            PrimaryForeground: '#FFCCCC',
            PrimaryBackground: '#555555',
            //...
        },
        // ...
    });
```

#### 🔹 reset *() => Promise&lt;ResponseMessage&gt;*

If you want to reset the changes, use the below method:

```javascript
    embeddedVisualExperience.reset();
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

Use `embedConsole` method to embed a QuickSight console. It returns a promise of `ConsoleExperience` type.

```typescript
 export class ConsoleExperience extends BaseExperience<ConsoleContentOptions, InternalConsoleExperience, IConsoleExperience, TransformedConsoleContentOptions, ConsoleExperienceFrame> {
   send: <EMV extends EventMessageValues = EventMessageValues>(messageEvent: TargetedMessageEvent) => Promise<ResponseMessage<EMV>>;
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
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@2.11.3/dist/quicksight-embedding-js-sdk.min.js"></script>
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

See [Common Properties of `frameOptions` for All Embedding Experiences](#common-properties-of-frameoptions-for-all-embedding-experiences) for `url`, `container`, `width`, `height`, `className`, `withIframePlaceholder`, `onChange`, `framePermissions` properties

&nbsp;  
### `contentOptions`
&nbsp;  

See [Common Properties of `contentOptions` for All Embedding Experiences](#common-properties-of-contentoptions-for-all-embedding-experiences) for `locale` property

#### 🔹 onMessage: *SimpleMessageEventHandler* *(optional)*

The `eventName`s the console experience receives

    ERROR_OCCURRED: Received when an error occurred while rendering the console. The message contains `errorCode`. The error codes are:
    - `Forbidden` -- the URL's authentication code expired
    - `Unauthorized` -- the session obtained from the authentication code expired
    If you follow the instructions to generate the correct URL, but you still receive these error codes, you need to generate a new URL.
    PAGE_NAVIGATION: Received when the embedded instance navigates to a new route. The message contains `pageType`, which corresponds to the new route.

&nbsp;  
### Actions
&nbsp;  

#### 🔹 createSharedView *() => Promise&lt;ResponseMessage&gt;*

If you want to share the current view, use the below method:

```javascript
    embeddedConsoleExperience.createSharedView();
```

This method can only be called from the `DASHBOARD` route. 

#### 🔹 toggleThresholdAlertsPane *() => Promise&lt;ResponseMessage&gt;*

If you want to toggle the threshold alerts pane, use the below method:

```javascript
    embeddedConsoleExperience.toggleThresholdAlertsPane();
```

This method can only be called from the `DASHBOARD` route. 

#### 🔹 toggleSchedulingPane *() => Promise&lt;ResponseMessage&gt;*

If you want to toggle the scheduling pane, use the below method:

```javascript
    embeddedConsoleExperience.toggleSchedulingPane();
```

This method can only be called from the `DASHBOARD` route. 

#### 🔹 toggleRecentSnapshotsPane *() => Promise&lt;ResponseMessage&gt;*

If you want to toggle the recent snapshots pane, use the below method:

```javascript
    embeddedConsoleExperience.toggleRecentSnapshotsPane();
```

This method can only be called from the `DASHBOARD` route. 

#### 🔹 toggleExecutiveSummaryPane *() => Promise&lt;ResponseMessage&gt;*

If you want to toggle the visibility state of the executive summary pane, use the below method:

```javascript
    embeddedConsoleExperience.toggleExecutiveSummaryPane();
```

This method can only be called from the `DASHBOARD` route.

#### 🔹 openDataQnAPane *() => Promise&lt;ResponseMessage&gt;*

If you want to toggle the visibility state of the GenBI data QnA pane, use the below method:

```javascript
    embeddedConsoleExperience.openDataQnAPane();
```

#### 🔹 openBuildVisualPane *() => Promise&lt;ResponseMessage&gt;*

If you want to toggle the visibility state of the GenBI build visual pane, use the below method:

```javascript
    embeddedConsoleExperience.openBuildVisualPane();
```

#### 🔹 buildStoryFromDashboard *() => Promise&lt;ResponseMessage&gt;*

If you want to build story from dashboard, use the below method:

```javascript
    embeddedConsoleExperience.buildStoryFromDashboard();
```

This method can only be called from the `DASHBOARD` route.


***

&nbsp;  
## QSearchBar Embedding
&nbsp;  

QSearchBar Embedding provides the [QuickSight Q](https://aws.amazon.com/quicksight/q/) search bar experience.

For more information, see  [Embedding Amazon QuickSight Q Search Bar](https://docs.aws.amazon.com/quicksight/latest/user/embedded-analytics-q-search-bar-for-authenticated-users.html) in the Amazon QuickSight User Guide.

&nbsp;  
### Getting Started
&nbsp;  

Use `embedQSearchBar` method to embed a Q search bar. It returns a promise of `QSearchExperience` type.

```typescript
export class QSearchExperience extends BaseExperience<QSearchContentOptions, InternalQSearchExperience, IQSearchExperience, TransformedQSearchContentOptions, QSearchExperienceFrame> {
   close: () => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   setQuestion: (question: string) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
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
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@2.11.3/dist/quicksight-embedding-js-sdk.min.js"></script>
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

See [Common Properties of `frameOptions` for All Embedding Experiences](#common-properties-of-frameoptions-for-all-embedding-experiences) for `url`, `container`, `width`, `height`, `className`, `withIframePlaceholder`, `onChange`, `framePermissions` properties

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

The `eventName`s the Q search bar experience receives

    Q_SEARCH_CLOSED: Received when the Q search collapsed
    Q_SEARCH_ENTERED_FULLSCREEN: Received when the Q search entered fullscreen
    Q_SEARCH_EXITED_FULLSCREEN: Received when the Q search exited fullscreen
    Q_SEARCH_OPENED: Received when the Q search expanded
    Q_SEARCH_SIZE_CHANGED: Received when the size of the Q search changed

&nbsp;  
### Actions
&nbsp;  

#### 🔹 setQuestion

This method sends a question to the Q search bar and immediately queries the question. It also automatically opens the Q popover.

```javascript
    embeddedQBarExperience.setQuestion('show me monthly revenue');
```

#### 🔹 close

This method closes the Q popover, returns the iframe to the original Q search bar size.

```javascript
    embeddedQBarExperience.close();
```

***

&nbsp;  
## Generative Q&A Embedding
&nbsp;  

Generative Q&A Embedding provides the [Amazon Q in QuickSight](https://aws.amazon.com/quicksight/q/) Generative Q&A experience.

For more information, see [Embed Generative Q&A Experience](https://docs.aws.amazon.com/quicksight/latest/user/embedded-analytics-api.html) in the Amazon QuickSight User Guide.

&nbsp;  
### Getting Started
&nbsp;  

Use `embedGenerativeQnA` method to embed the Generative Q&A experience. It returns a promise of `GenerativeQnAExperience` type.

```typescript
export class GenerativeQnAExperience extends BaseExperience<GenerativeQnAContentOptions, InternalGenerativeQnAExperience, IGenerativeQnAExperience, TransformedGenerativeQnAContentOptions, GenerativeQnAExperienceFrame> {
   close: () => Promise<SuccessResponseMessage | ErrorResponseMessage>;
   setQuestion: (question: string) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
}
```

&nbsp;  
### Example
&nbsp;  

```html
<!DOCTYPE html>
<html>

    <head>
        <title>Generative Q&A Embedding Example</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@2.11.3/dist/quicksight-embedding-js-sdk.min.js"></script>
        <script type="text/javascript">
            const embedGenerativeQnA = async() => {    
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
                    panelOptions: {
                        panelType: 'FULL',
                        title: 'Custom Title',
                        showQIcon: false,
                    },
                    // Uncomment below, if you prefer an experience closer to embedQSearchBar instead of a full panel.
                    /*
                    panelOptions: {
                        panelType: 'SEARCH_BAR',
                        focusedHeight: '250px',
                        expandedHeight: '500px',
                    },
                    */
                    showTopicName: false,
                    showPinboard: false,
                    allowTopicSelection: false,
                    allowFullscreen: false,
                    searchPlaceholderText: 'Custom Search Placeholder',
                    themeOptions: {
                        themeArn: 'arn:aws:quicksight:<Region>:<AWS-Account-ID>:theme/<Theme-ID>'
                    }
                    onMessage: async (messageEvent, experienceMetadata) => {
                        switch (messageEvent.eventName) {
                            case 'Q_SEARCH_OPENED': {
                                console.log("Do something when SEARCH_BAR type panel is expanded");
                                break;
                            }
                            case 'Q_SEARCH_FOCUSED': {
                                console.log("Do something when SEARCH_BAR type panel is focused");
                                break;
                            }
                            case 'Q_SEARCH_CLOSED': {
                                console.log("Do something when SEARCH_BAR type panel is collapsed");
                                break;
                            }
                            case 'Q_PANEL_ENTERED_FULLSCREEN': {
                                console.log("Do something when the experience enters full screen mode");
                                break;
                            }
                            case 'Q_PANEL_EXITED_FULLSCREEN': {
                                console.log("Do something when the experience exits full screen mode");
                                break;
                            }
                            case 'CONTENT_LOADED': {
                                console.log("Do something when the experience is loaded");
                                break;
                            }
                            case 'ERROR_OCCURRED': {
                                console.log("Do something when an error occurs.");
                                break;
                            }
                        }
                    }
                };
                const embeddedGenerativeQnExperience = await embeddingContext.embedGenerativeQnA(frameOptions, contentOptions);
            };
        </script>
    </head>

    <body onload="embedGenerativeQnA()">
        <div id="experience-container"></div>
    </body>

</html>
```

&nbsp;  
### `frameOptions`
&nbsp; 

See [Common Properties of `frameOptions` for All Embedding Experiences](#common-properties-of-frameoptions-for-all-embedding-experiences) for `url`, `container`, `width`, `height`, `className`, `withIframePlaceholder`, `onChange`, `framePermissions` properties

Note that while using `SEARCH_BAR` panel type, you'll likely want to use `className` to give the iframe a `position: absolute` so that when expanded it does not shift the contents of your application. If elements in your application are appearing in front of the search bar, you can provide the iframe with a higher z-index as well.

&nbsp;  
### `contentOptions`
&nbsp;  

#### 🔹 showTopicName: *boolean* *(optional, default=true)*
The `showTopicName` property can be used to customize whether or not the QuickSight Q Topic name appears in the experience.

#### 🔹 showPinboard: *boolean* *(optional, default=true)*
The `showPinboard` property can be used to customize whether or not pinboard button is shown. For more information, see [Pinning visuals in Amazon QuickSight Q](https://docs.aws.amazon.com/quicksight/latest/user/quicksight-q-pin-board.html). This property has no effect for anonymous user embedding, pinboard is usable by registered users only.

#### 🔹 showSearchBar: *boolean* *(optional, default=true)*
The `showSearchBar` property can be used to customize whether or not search bar is shown in the answer panel.

#### 🔹 showInterpretedAs: *boolean* *(optional, default=true)*
The `showInterpretedAs` property can be used to customize whether or not interpreted statement is shown in the answer panel.

#### 🔹 showFeedback: *boolean* *(optional, default=true)*
The `showFeedback` property can be used to customize whether or not feedback button is shown in the answer panel.

#### 🔹 showGeneratedNarrative: *boolean* *(optional, default=true)*
The `showGeneratedNarrative` property can be used to customize whether or not generated narrative is shown in the answer panel.

#### 🔹 showDidYouMean: *boolean* *(optional, default=true)*
The `showDidYouMean` property can be used to customize whether or not alternative questions (if any) are shown in the answer panel.

#### 🔹 showComplementaryVisuals: *boolean* *(optional, default=true)*
The `showComplementaryVisuals` property can be used to customize whether or not complementary visuals are shown in the answer panel.

#### 🔹 showQBusinessInsights: *boolean* *(optional, default=true)*
The `showQBusinessInsights` property can be used to customize whether or not additional insights from Q business or the notification for enabling Q business insights are shown in the answer panel.

#### 🔹 showSeeWhy: *boolean* *(optional, default=true)*
The `showSeeWhy` property can be used to customize whether or not see why button is shown in the answer panel.

#### 🔹 allowReturn: *boolean* *(optional, default=true)*
The `allowReturn` property can be used to customize whether or not the back button to exit from the answer panel will be shown.

#### 🔹 initialQuestionId: *string* *(optional, default='')*
The `initialQuestionId` property can be used to query existing question and display the answer panel directly.

#### 🔹 initialAnswerId: *string* *(optional, default='')*
The `initialAnswerId` property can be used to query existing answer of verified question and display the answer panel directly.

#### 🔹 allowTopicSelection: *boolean* *(optional, default=true)*
The `allowTopicSelection` property can be used to customize whether or not the embedded user can change the selected topic. Note that this can only be set to false if the `initialTopicId` was specified in the embedding API; for more information, see [QuickSight Embedding APIs](https://docs.aws.amazon.com/en_us/quicksight/latest/APIReference/embedding-quicksight.html).

#### 🔹 allowFullscreen: *boolean* *(optional, default=true)*
The `allowFullscreen` property can be used to customize whether or the experience is allowed to enter into full-screen mode.

#### 🔹 searchPlaceholderText: *string* *(optional)*
The `searchPlaceholderText` property can be used to customize the placeholder text shown in the search text input field, when there is not a question being asked. Maximum 200 characters are allowed.

#### 🔹 panelOptions: *(optional)*
The `panelOptions` property can be used to customize additional properties for full panel and search bar panel types.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 panelType: *string*
The `panelType` property can be used to choose between full panel and search bar panel types. If `panelOptions` object is provided, then this property must also be set to either `FULL` or `SEARCH_BAR`.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 title: *string* *(optional)*
The `title` property can be used to customize the panel title. Only valid for `FULL` panel type. Maximum 200 characters are allowed.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 showQIcon: *boolean* *(optional, default=true)*
The `showQIcon` property can be used to customize whether Q icon will be shown. Only valid for `FULL` panel type.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 focusedHeight: *string* *(optional)*
The `focusedHeight` property can be used to customize the height when the search bar is focused. This height is used when question suggestions are shown, or topic selection dropdown is opened. Only valid for `SEARCH_BAR` panel type.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 expandedHeight: *boolean* *(optional, default=true)*
The `focusedHeight` property can be used to customize the height when the search bar is expanded. This height is used when user gets an answer, or opens the pinboard. Only valid for `SEARCH_BAR` panel type.

#### 🔹 themeOptions

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 themeArn: *string* *(optional)*
The `themeArn` property can be used to to specify the theme the experience should load with.

#### 🔹 onMessage: *SimpleMessageEventHandler* *(optional)*

The `eventName`s the Generative Q&A experience receives

    Q_SEARCH_OPENED: Received when SEARCH_BAR type panel is expanded
    Q_SEARCH_FOCUSED: Received when SEARCH_BAR type panel is focused
    Q_SEARCH_CLOSED: Received when SEARCH_BAR type panel is collapsed
    Q_PANEL_ENTERED_FULLSCREEN: Received when the experience enters full screen mode
    Q_PANEL_EXITED_FULLSCREEN: Received when the experience exits full screen mode
    CONTENT_LOADED: Received when the experience is loaded
    ERROR_OCCURRED: Received when an error occurs. The message contains `errorCode`. The error codes are:
    - Q_NO_TOPICS_AVAILABLE: User has no topic created or shared with them they can query with. There will not be any content rendered once this happens.
    - Q_INITIAL_TOPIC_NOT_FOUND: The topic specified by InitialTopicId is not found.
    - Q_TOPIC_EXPERIENCE_MISMATCH: Some or all topics do not have the expected user experience version.
    - Q_TOPIC_NOT_QUERYABLE: Some or all topics are not queryable.

&nbsp;  
### Actions
&nbsp;  

#### 🔹 setQuestion

This method sends a question to the experience and immediately queries that question. It also triggers the search bar to open, if using that panel type. 

```javascript
    embeddedGenerativeQnExperience.setQuestion('show me monthly revenue');
```

#### 🔹 close

This method closes the search bar, returns the iframe to the original search bar size. It has no effect for `FULL` panel type.

```javascript
    embeddedGenerativeQnExperience.close();
```

***

&nbsp;  
## Quick Chat Embedding
&nbsp;  

Quick Chat embedding provides an Amazon Quick Suite chat bot assistant.

&nbsp;  
### Getting Started
&nbsp;  

Use `embedQuickChat` method to embed the Quick Chat experience. It returns a promise of `QuickChatExperience` type.

```typescript
export class QuickChatExperience extends BaseExperience<QuickChatContentOptions, InternalQuickChatExperience, IQuickChatExperience, TransformedQuickChatContentOptions, QuickChatExperienceFrame> {
   sendPrompt: (prompt: string) => Promise<SuccessResponseMessage | ErrorResponseMessage>;
}
```

&nbsp;  
### Example
&nbsp;  

```html
<!DOCTYPE html>
<html>

    <head>
        <title>Quick Chat Embedding Example</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@2.11.3/dist/quicksight-embedding-js-sdk.min.js"></script>
        <script type="text/javascript">
            const embedQuickChat = async() => {    
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
                    agentOptions: {
                        fixedAgentId: 'your-agent-id',
                    },
                    promptOptions: {
                        allowFileAttachments: true,
                        initialPrompt: 'What is the total revenue for Q4?',
                        showAgentKnowledgeBoundary: true,
                        showInitialPromptMessage: true,
                        showWebSearch: true,
                        showChatHistory: true,
                        showPromptArea: true,
                        enablePrivateMode: false,
                    },
                    footerOptions: {
                        showBrandAttribution: true,
                        showUsagePolicy: true,
                    },
                    onMessage: async (messageEvent, experienceMetadata) => {
                        switch (messageEvent.eventName) {
                            case 'CONTENT_LOADED': {
                                console.log("Do something when the chat is displayed");
                                break;
                            }
                        }
                    }
                };
                const embeddedQuickChatExperience = await embeddingContext.embedQuickChat(frameOptions, contentOptions);
            };
        </script>
    </head>

    <body onload="embedQuickChat()">
        <div id="experience-container"></div>
    </body>

</html>
```

&nbsp;  
### `frameOptions`
&nbsp; 

See [Common Properties of `frameOptions` for All Embedding Experiences](#common-properties-of-frameoptions-for-all-embedding-experiences) for `url`, `container`, `width`, `height`, `className`, `withIframePlaceholder`, `onChange`, `framePermissions` properties

Note: `frameOptions.framePermissions.clipboardRead` and `frameOptions.framePermissions.clipboardWrite` default to `true` for Quick Chat Embedding.

&nbsp;  
### `contentOptions`
&nbsp;  

#### 🔹 agentOptions: *(optional)*
The `agentOptions` property can be used to customize agent-related settings.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 fixedAgentId: *string* *(optional)*
The `fixedAgentId` property can be used to specify an agent selected for the duration of the session. This also disables the agent selector.

#### 🔹 promptOptions: *(optional)*
The `promptOptions` property can be used to customize prompt-related settings and UI elements.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 initialPrompt: *string* *(optional)*
The `initialPrompt` property can be used to define a prompt that will be sent once on initial chat panel load.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 allowFileAttachments: *boolean* *(optional, default=true)*
The `allowFileAttachments` property can be used to show or hide the file attachment button and also enable or disable attaching files to the conversation by drag and drop onto the prompt.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 showAgentKnowledgeBoundary: *boolean* *(optional, default=true)*
The `showAgentKnowledgeBoundary` property can be used to show or hide the agent knowledge boundary menu.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 showInitialPromptMessage: *boolean* *(optional, default=true)*
The `showInitialPromptMessage` property can be used to show or hide the user message bubble from the configured `initialPrompt`. When set to `false`, the initial prompt is still sent but the user message is not displayed in the chat.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 showPromptArea: *boolean* *(optional, default=true)*
The `showPromptArea` property can be used to show or hide the prompt input and disclaimer at the bottom of the chat thread. When set to `false`, the prompt input and AWS disclaimer will be hidden.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 showChatHistory: *boolean* *(optional, default=true)*
The `showChatHistory` property can be used to show or hide header above the chat thread that includes the chat history button. When set to `false`, header and chat history button will be hidden.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 enablePrivateMode: *boolean* *(optional, default=false)*
The `enablePrivateMode` property can be used to enforce private mode on the chat. When set to `true`, the conversation will start with private mode toggled on.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 showWebSearch: *boolean* *(optional, default=true)*
The `showWebSearch` property can be used to show or hide the web search button.

#### 🔹 footerOptions: *(optional)*
The `footerOptions` property can be used to customize footer-related UI elements.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 showBrandAttribution: *boolean* *(optional, default=true)*
The `showBrandAttribution` property can be used to show or hide the Amazon Quick Suite brand attribution statement.

#### &nbsp;&nbsp;&nbsp;&nbsp; 🔹 showUsagePolicy: *boolean* *(optional, default=true)*
The `showUsagePolicy` property can be used to show or hide the Amazon usage policy statement and link.

#### 🔹 fixedAgentArn: *string* *(optional, deprecated)*
The `fixedAgentArn` property can be used to specify an agent selected for the duration of the session. This also disables the agent selector. This property is deprecated, use `agentOptions.fixedAgentId` instead.

#### 🔹 onMessage: *EventListener* *(optional)*

The `eventName`s the quick chat experience receives

    CONTENT_LOADED: Received when the experience is loaded
    ERROR_OCCURRED: Received when an error occurs.

&nbsp;  
### Actions
&nbsp;  

#### 🔹 sendPrompt

This method sends a prompt to the chat experience.

```javascript
    embeddedQuickChatExperience.sendPrompt('What is the total revenue for Q4?');
```

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
Copyright 2025 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
