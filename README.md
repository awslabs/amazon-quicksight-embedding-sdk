# Amazon QuickSight Embedding SDK
&nbsp;  
Thank you for using the Amazon QuickSight JavaScript SDK. You can use this SDK to embed Amazon QuickSight in your HTML.

For more information and to learn how to use QuickSight Embedding, please visit [QuickSight Developer Portal Website](https://developer.quicksight.aws/)

Amazon QuickSight offers four different embedding experiences with options for branding, user isolation with namespaces, and custom UI permissions.

* [Dashboard Embedding](#dashboard-embedding)
* [Visual Embedding](#visual-embedding)
* [Console Embedding](#console-embedding)
* [QSearchBar Embedding](#qsearchbar-embedding)

&nbsp;  
## Installation
&nbsp;  

-  **Option 1:** Use the Amazon QuickSight Embedding SDK in the browser:
   ```html
    <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@1.20.1/dist/quicksight-embedding-js-sdk.min.js"></script>
   ```
-  **Option 2:** Install the QuickSight Embedding SDK in NodeJs:
   ```shell
    npm install amazon-quicksight-embedding-sdk
   ```
   and then use it in your code using `require` syntax
   ```javascript
    const QuickSightEmbedding = require("amazon-quicksight-embedding-sdk");

    const embeddedDashboardExperience = QuickSightEmbedding.embedDashboard(options);
   ```

   or, using named `import` syntax:

   ```javascript
    import {
        embedDashboard,
        embedVisual,
        embedSession,
        embedQSearchBar,
    } from 'amazon-quicksight-embedding-sdk';

    const embeddedDashboardExperience = embedDashboard(options);
   ```

   or, using wildcard `import` syntax:

   ```javascript
    import * as QuickSightEmbedding from 'amazon-quicksight-embedding-sdk';

    const embeddedQSearchBarExperience = QuickSightEmbedding.embedQSearchBar(options);
   ```

&nbsp;  
### Common Options for All Embedding Experiences
&nbsp;  

#### 🔹 url: *string* *(required)*

This is the embed URL you have generated using the [QuickSight API Operations for Embedding](https://docs.aws.amazon.com/en_us/quicksight/latest/APIReference/embedding-quicksight.html).

Follow [Embedding with the QuickSight API](https://docs.aws.amazon.com/quicksight/latest/user/embedded-analytics-api.html) in the Amazon QuickSight User Guide to generate the url.

For each experience, you need to make sure that the users are granted the necessary permissions to view the embedded experience.

#### 🔹 container: *string | HTMLElement* *(required)*

This is the parent HTMLElement where we're going to embed QuickSight.

It can be an HTMLElement:
```javascript
    container: document.getElementById("embeddingContainer")
```
Or, it can be a query selector string:
```javascript
    container: "#embeddingContainer"
```

#### 🔹 scrolling: *'auto' | 'yes' | 'no'* *(optional, default='no')*

This lets you set up a specific scrolling experience for the iframe that holds your embedded QuickSight session.

#### 🔹 width: *string* *(optional, default='100%')*, 🔹 height: *string* *(optional, default='100%')*

You can set `width` and `height` for the iframe that holds your embedded QuickSight session. Both of these default to 100%. You can set them to be fixed values:
```javascript
    height: "700px",
    width: "1000px"
```

Or, relative values:
```javascript
    height: "80%",
    width: "60%"
```

To make your embedded QuickSight session responsive, don't set `width` or `height` (leave them at the default: `100%`). Then you can make the container HTMLElement responsive to screen size change.

#### 🔹 className: *string* *(optional)*

You can customize style of the iframe that holds your dashboard by one of the followings:

-  Option 1: Use the "quicksight-embedding-iframe" class we predefined for you:
```
quicksight-embedding-iframe {
    margin: 5px;
}
```
-  Option 2: Or, create your own class and pass in through `className` element:
```
your-own-class {
    margin: 5px;
}
```
```javascript
    className: "your-own-class",
```

We've overridden the border and padding of the iframe to be 0px, because setting border and padding on the iframe might cause unexpected issues. If you have to set border and padding on the embedded QuickSight session, set it on the container div that contains the iframe.


#### 🔹 locale: *string* *(optional)*

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

#### 🔹 parameters: *Object* *(optional)*

This is an object that contains `key:value` pairs for parameters names:values.
It allows you to set initial parameter values for your embedded QuickSight session. Pass an array as value for multi-value parameters.
For more information about parameters in Amazon QuickSight, see https://docs.aws.amazon.com/quicksight/latest/user/parameters-in-quicksight.html

#### 🔹 errorCallback: *Function* *(optional)*

If you want your application get notified and respond when the embedded QuickSight session fails to load, use a error callback.

```javascript
    errorCallback: yourErrorCallback,
```

Alternatively, you can register the "error" event on the returned experience object.

```javascript
     embeddedExperience.on("error", yourErrorCallback);
```

We pass a payload object to your callback function with a specific `payload.errorCode`. Currently, the error codes are:

- `Forbidden` -- the URL's authentication code expired

- `Unauthorized` -- the session obtained from the authentication code expired

If you follow the instructions to generate the correct URL, but you still receive these error codes, you need to generate a new URL.

&nbsp;  
### Common Actions for All Embedding Experiences
&nbsp;  

#### 🔹 setParameters: *Function* *(optional)*

Use this function to update parameter values. Pass an array as value for multi-value parameters.
You can build your own UI to trigger this, so that viewers of the embedded QuickSight session can control it from your app page.

Parameters in an embedded experience session can be set by using the following call:
```javascript
    embeddedExperience.setParameters({country: "United States", states: ["California", "Washington"]});
```

To reset a parameter so that it includes all values, you can pass the string `"[ALL]"`.
```javascript
    embeddedExperience.setParameters({country: "United States", states: "[ALL]" });
```

&nbsp;  
## Dashboard Embedding
&nbsp;  

Dashboard Embedding provides an interactive read-only experience. The level of interactivity is set when the dashboard is published.

For more information, see  [Working with embedded analytics](https://docs.aws.amazon.com/quicksight/latest/user/embedded-analytics.html) in the Amazon QuickSight User Guide.

&nbsp;  
### Getting Started
&nbsp;  

```javascript
    import { embedDashboard } from 'amazon-quicksight-embedding-sdk';

    const embeddedDashboardExperience = embedDashboard(options);
```
This returns a dashboard object for further action.

&nbsp;  
### Options
&nbsp;  

#### 🔹 printEnabled: *boolean* *(optional, default=false)*
This can be used to enable or disable print option for dashboard embedding. If "undoRedo" and "reset" are disabled and "printEnabled" is set to false, then the navrbar is hidden.

#### 🔹 undoRedoDisabled: *boolean* *(optional, default=false)*
This can be used to disable undo and redo buttons for dashboard embedding. If "undoRedo" and "reset" are disabled and "printEnabled" is set to false, then the navrbar is hidden.

#### 🔹 resetDisabled: *boolean* *(optional, default=false)*
This can be used to disable reset button for dashboard embedding. If "undoRedo" and "reset" are disabled and "printEnabled" is set to false, then the navrbar is hidden.

#### 🔹 sheetId: *string* *(optional)*
You can use this when you want to specify the initial sheet of the dashboard, instead of loading the first sheet of the embedded dashboard. You can provide the target sheet id of the dashboard as the value. In case the sheet id value is invalid, the first sheet of the dashboard will be loaded.

#### 🔹 sheetTabsDisabled: *boolean* *(optional, default=false)*
The `sheetTabsDisabled` element can be used to enable or disable sheet tab controls in dashboard embedding.

#### 🔹 footerPaddingEnabled: *boolean* *(optional, default=false)*

This adds 22 pixels of space at the bottom of the layout. You can set this to `true` if the "Powered by QuickSight" footer blocks part of your visual.

#### 🔹 iframeResizeOnSheetChange: *boolean* (optional default=false)
You can use this in combination with `height: "AutoFit"` option, when you want the embedded dashboard height to auto resize based on sheet height, on every sheet change event.

#### 🔹 parametersChangeCallback: *Function* *(optional)*

If you want your application to get notified and respond when the parameters in Amazon QuickSight dashboard changes, use the parameter change callback.

```javascript
    parametersChangeCallback: yourParametersChangeCallback,
```

Alternatively, you can register the "parametersChange" event on the returned dashboard object.
```javascript
    embeddedDashboardExperience.on("parametersChange", yourParametersChangeCallback);
```

#### 🔹 selectedSheetChangeCallback: *Function* *(optional)*

If you want your application to get notified and respond when the selected sheet in Amazon QuickSight dashboard changes, use the selected sheet change callback.

```javascript
    selectedSheetChangeCallback: yourSelectedSheetChangeCallback,
```

Alternatively, you can register the "selectedSheetChange" event on the returned dashboard object.
```javascript
    embeddedDashboardExperience.on("selectedSheetChange", yourSelectedSheetChangeCallback);
```

#### 🔹 loadCallback: *Function*  *(optional)*

If you want your application to get notified and respond when the Amazon QuickSight dashboard is fully loaded, use a load callback.

```javascript
    loadCallback: yourLoadCallback,
```

Alternatively, you can register the "load" event on the returned dashboard object.
```javascript
    embeddedDashboardExperience.on("load", yourLoadCallback);
```

#### 🔹 height: 'AutoFit' *(optional)*, 🔹 loadingHeight: *string* *(optional)*

You can also choose to set height to be `AutoFit` to make the iframe fit your dashboard height. Use `loadingHeight` to specify the height you'd like to use before actual dashboard height is known.
```javascript
    height: "AutoFit",
    loadingHeight: "700px"
```

Note: With AutoFit height enabled, modals generated by the dashboard can be hidden
if the content is larger than the screen. An example of this type of modal is the one that displays when you select "Export to CSV" on a Table visual. To solve this issue, you can add the following code to autoscroll the focus to the modal.
```javascript
embeddedDashboardExperience.on("SHOW_MODAL_EVENT", () => {
    window.scrollTo({
        top: 0 // iframe top position
    });
});
```

&nbsp;  
### Actions
&nbsp;  

#### 🔹 navigateToDashboard

To navigate to a different dashboard, use dashboard.navigateToDashboard(options). The input parameter options should contain the dashboardId that you want to navigate to, and also the parameters for that dashboard, for example:
```javascript
    const options = {
        dashboardId: "37a99f75-8230-4409-ac52-e45c652cc21e",
        parameters: {
            country: [
                "United States"
            ]
        }
    };
    embeddedDashboardExperience.navigateToDashboard(options);
```

#### 🔹 navigateToSheet

If you want to navigate from one sheet to another programmatically, with the Amazon quicksight dashboard, use the below method:

```javascript
    embeddedDashboardExperience.navigateToSheet(sheetId);
```

#### 🔹 getSheets

If you want to get the current set of sheets, from Amazon Quicksight dashboard in ad-hoc manner, use the below method with a callback:

```javascript
    embeddedDashboardExperience.getSheets(yourCallback);
```

The callback is needed since the process of getting sheets is asynchronous, even for ad-hoc fetches.

#### 🔹 initiatePrint

This feature allows you to initiate dashboard print, from parent website, without a navbar print icon, in the dashboard. To initiate a dashboard print from parent website, use dashboard.initiatePrint(), for example:
```javascript
    embeddedDashboardExperience.initiatePrint();
```

#### 🔹 getActiveParameterValues

If you want to get the active parameter values, from Amazon Quicksight dashboard in ad-hoc manner, use the below method with a callback:

```javascript
    embeddedDashboardExperience.getActiveParameterValues(yourCallback);
```

The callback is needed since the process of getting active parameter values is asynchronous, even for ad-hoc fetches.

&nbsp;  
### Example
&nbsp;  

```html
    <!DOCTYPE html>
    <html>

    <head>
        <title>Dashboard Embedding Example</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@1.20.1/dist/quicksight-embedding-js-sdk.min.js"></script>
        <script type="text/javascript">
            let embeddedDashboardExperience;
            function onDashboardLoad(payload) {
                console.log("Do something when the dashboard is fully loaded.");
            }

            function onError(payload) {
                console.log("Do something when the dashboard fails loading");
            }

            function embedDashboard() {
                const containerDiv = document.getElementById("embeddingContainer");
                const options = {
                    url: "<YOUR_EMBED_URL>", // replace this value with the url generated via embedding API
                    container: containerDiv,
                    parameters: {
                        country: "United States",
                        states: [
                            "California",
                            "Washington"
                        ]
                    },
                    scrolling: "no",
                    height: "700px",
                    width: "1000px",
                    iframeResizeOnSheetChange: false,
                    sheetId: 'YOUR_SHEETID',
                    sheetTabsDisabled: false,
                    locale: "en-US",
                    footerPaddingEnabled: true,
                    printEnabled: false,
                    undoRedoDisabled: false,
                    resetDisabled: false
                };
                embeddedDashboardExperience = QuickSightEmbedding.embedDashboard(options);
                embeddedDashboardExperience.on("error", onError);
                embeddedDashboardExperience.on("load", onDashboardLoad);
            }

            function onCountryChange(obj) {
                embeddedDashboardExperience.setParameters({country: obj.value});
            }
        </script>
    </head>

    <body onload="embedDashboard()">
        <span>
            <label for="country">Country</label>
            <select id="country" name="country" onchange="onCountryChange(this)">
                <option value="United States">United States</option>
                <option value="Mexico">Mexico</option>
                <option value="Canada">Canada</option>
            </select>
        </span>
        <div id="embeddingContainer"></div>
    </body>

    </html>
```

&nbsp;  
## Visual Embedding
&nbsp;  

Visual Embedding provides an interactive read-only experience.

For more information, see  [Embedding Amazon QuickSight Visuals](https://docs.aws.amazon.com/console/quicksight/visual-embedding) in the Amazon QuickSight User Guide.

&nbsp;  
### Getting Started
&nbsp;  

```javascript
    import { embedVisual } from 'amazon-quicksight-embedding-sdk';

    const embeddedVisualExperience = embedVisual(options);
```
This returns a visual object for further action.

&nbsp;  
### Options
&nbsp;  

#### 🔹 fitToIframeWidth: *boolean* *(optional, default=true)*

If this is set to `false`, the visual keeps its dimensions as it was designed within its dashboard layout. Otherwise, it adjusts its width to match the iframe's width, while maintaining the original aspect ratio.

#### 🔹 parametersChangeCallback: *Function* *(optional)*

If you want your application to get notified and respond when the parameters in Amazon QuickSight dashboard changes, use the parameter change callback. Choose one of the following:

-  Use options:
```javascript
    parametersChangeCallback: yourParametersChangeCallback,
```

- Or, register the "parametersChange" event on the returned dashboard object:
```javascript
    embeddedVisualExperience.on("parametersChange", yourParametersChangeCallback);
```

#### 🔹 loadCallback: *Function* *(optional)*

If you want your application to get notified and respond when the Amazon QuickSight visual is fully loaded, use a load callback. Choose one of the following:

-  Use options:
```javascript
    loadCallback: yourLoadCallback,
```

- Or, register the "load" event on the returned visual object:
```javascript
    embeddedVisualExperience.on("load", yourLoadCallback);
```

#### 🔹 height: 'AutoFit' *(optional)*, 🔹 loadingHeight: *string* *(optional)*

You can also choose to set height to be `AutoFit` to make the iframe fit your visual height. Use `loadingHeight` to specify the height you'd like to use before actual visual height is known.
```javascript
    height: "AutoFit",
    loadingHeight: "700px"
```

&nbsp;  
### Actions
&nbsp;  

#### 🔹 getActiveParameterValues

If you want to get the active parameter values, from Amazon Quicksight visual in ad-hoc manner, use the below method with a callback:

```javascript
    embeddedVisualExperience.getActiveParameterValues(yourCallback);
```

The callback is needed since the process of getting active parameter values is asynchronous, even for ad-hoc fetches.

&nbsp;  
### Example
&nbsp;  

```html
    <!DOCTYPE html>
    <html>

    <head>
        <title>Visual Embedding Example</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@1.20.1/dist/quicksight-embedding-js-sdk.min.js"></script>
        <script type="text/javascript">
            let embeddedVisualExperience;
            function onVisualLoad(payload) {
                console.log("Do something when the visual is fully loaded.");
            }

            function onError(payload) {
                console.log("Do something when the visual fails loading");
            }

            function embedVisual() {
                const containerDiv = document.getElementById("embeddingContainer");
                const options = {
                    url: "<YOUR_EMBED_URL>", // replace this value with the url generated via embedding API
                    container: containerDiv,
                    parameters: {
                        country: "United States"
                    },
                    height: "700px",
                    width: "1000px",
                    locale: "en-US"
                };
                embeddedVisualExperience = QuickSightEmbedding.embedVisual(options);
                embeddedVisualExperience.on("error", onError);
                embeddedVisualExperience.on("load", onVisualLoad);
            }

            function onCountryChange(obj) {
                embeddedVisualExperience.setParameters({country: obj.value});
            }
        </script>
    </head>

    <body onload="embedVisual()">
        <span>
            <label for="country">Country</label>
            <select id="country" name="country" onchange="onCountryChange(this)">
                <option value="United States">United States</option>
                <option value="Mexico">Mexico</option>
                <option value="Canada">Canada</option>
            </select>
        </span>
        <div id="embeddingContainer"></div>
    </body>

    </html>
```

&nbsp;  
## Console Embedding
&nbsp;  

Console embeding provides the QuickSight authoring experience.

  For more information, see [Embedding the Amazon QuickSight Console](https://docs.aws.amazon.com/quicksight/latest/user/embedded-analytics-full-console-for-authenticated-users.html)

  Embedded authoring experience allows the user to create QuickSight assets, just like they can in the AWS console for QuickSight. Exactly what the user can do in the console is controlled by a custom permission profile. The profile can remove abilities such as creating or updating data sources and datasets. You can set also the default visual type. Embedded consoles currently don't support screen scaling in formatting options.

&nbsp;  
### Getting Started
&nbsp;  

```javascript
    import { embedSession } from 'amazon-quicksight-embedding-sdk';

    const embeddedSessionExperience = embedSession(options);
```
This returns an console session object for further action.

&nbsp;  
### Options
&nbsp;  

#### 🔹 defaultEmbeddingVisualType: *'TABLE' | 'AUTO_GRAPH'* *(optional)*
You can set the embedding visual type for embedded sessions. The default visual type provided in the options will be used during visual creating. By default, when you add a new visual in an embedded session, `AUTO_GRAPH` is selected by default. 

&nbsp;  
### Example
&nbsp;  

```html
    <!DOCTYPE html>
    <html>

    <head>
        <title>QuickSight Console Embedding</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@1.20.1/dist/quicksight-embedding-js-sdk.min.js"></script>
        <script type="text/javascript">
            let embeddedSessionExperience;

            function onError(payload) {
                console.log("Do something when the session fails loading");
            }

            function embedSession() {
                const containerDiv = document.getElementById("embeddingContainer");
                const options = {
                    url: "<YOUR_EMBED_URL>", // replace this value with the url generated via embedding API
                    container: containerDiv,
                    parameters: {
                        country: "United States"
                    },
                    scrolling: "no",
                    height: "700px",
                    width: "1000px",
                    locale: "en-US",
                    footerPaddingEnabled: true,
                    defaultEmbeddingVisualType: "TABLE",
                };
                embeddedSessionExperience = QuickSightEmbedding.embedSession(options);
                embeddedSessionExperience.on("error", onError);
            }

            function onCountryChange(obj) {
                embeddedSessionExperience.setParameters({country: obj.value});
            }
        </script>
    </head>

    <body onload="embedSession()">
        <span>
            <label for="country">Country</label>
            <select id="country" name="country" onchange="onCountryChange(this)">
                <option value="United States">United States</option>
                <option value="Mexico">Mexico</option>
                <option value="Canada">Canada</option>
            </select>
        </span>
        <div id="embeddingContainer"></div>
    </body>

    </html>
```

&nbsp;  
## QSearchBar Embedding
&nbsp;  

QSearchBar Embedding provides the [QuickSight Q](https://aws.amazon.com/quicksight/q/) search bar experience.

For more information, see  [Embedding Amazon QuickSight Q Search Bar](https://docs.aws.amazon.com/quicksight/latest/user/embedded-analytics-q-search-bar-for-authenticated-users.html) in the Amazon QuickSight User Guide.

&nbsp;  
### Getting Started
&nbsp;  

```javascript
    import { embedQSearchBar } from 'amazon-quicksight-embedding-sdk';

    const embeddedQBarExperience = embedQSearchBar(options);
```
This returns a Q search bar object for further action.

&nbsp;  
### Options
&nbsp;  

The `qSearchBarOptions` object is to specify Q specific options when embedding:
```javascript
    const qSearchBarOptions = {
        expandCallback: () => {},
        collapseCallback: () => {},
        iconDisabled: false,
        topicNameDisabled: false,
        themeId: 'theme12345',
        allowTopicSelection: true
    };
```

Note for Q search bar embedding, you'll likely want to use `className` to give the iframe a `position: absolute` so that when expanded it does not shift the contents of your application. If elements in your application are appearing in front of the Q search bar, you can provide the iframe with a higher z-index as well.

#### 🔹 expandCallback: *Function* *(optional)*
The `expandCallback` in `qSearchBarOptions` can be used to specify behavior for your application when the Q search bar is expanded (clicked into).

#### 🔹 collapseCallback: *Function* *(optional)*
The `collapseCallback` in `qSearchBarOptions` can be used to specify behavior for your application when the Q search bar is collapsed (clicked out of).

#### 🔹 iconDisabled: *boolean* *(optional, default=false)*
The `iconDisabled` element in `qSearchBarOptions` can be used to customize whether or not the QuickSight Q icon appears in the embedded search bar.

#### 🔹 topicNameDisabled: *boolean* *(optional, default=false)*
The `topicNameDisabled` element in `qSearchBarOptions` can be used to customize whether or not the QuickSight Q Topic name appears in the embedded search bar.

#### 🔹 themeId: *string* *(optional)*
The `themeId` element in `qSearchBarOptions` can be used to set a content theme for the embedded search bar. Note that the embedded QuickSight user, or the group or namespace they belong to, must have permissions on this theme. The default theme is the default QuickSight theme seen in the console application.

#### 🔹 allowTopicSelection: *boolean* *(optional)*
The `allowTopicSelection` element in `qSearchBarOptions` can be used to customize whether or not the embedded user can change the selected topic for the Q search bar. Note that this can only be set to false if the `initialTopicId` was specified in the embedding API; for more information, see [QuickSight Embedding APIs](https://docs.aws.amazon.com/en_us/quicksight/latest/APIReference/embedding-quicksight.html). The default value is `true`.

&nbsp;  
### Actions
&nbsp;  

#### 🔹 setQBarQuestion

This feature sends a question to the Q search bar and immediately queries the question. It also automatically opens the Q popover.

```javascript
    embeddedQBarExperience.setQBarQuestion('show me monthly revenue');
```

#### 🔹 closeQPopover

This feature closes the Q popover, returns the iframe to the original Q search bar size.

```javascript
    embeddedQBarExperience.closeQPopover();
```

&nbsp;  
### Example
&nbsp;  

```html
    <!DOCTYPE html>
    <html>

    <head>
        <title>QuickSight Q Search Bar Embedding</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@1.20.1/dist/quicksight-embedding-js-sdk.min.js"></script>
        <script type="text/javascript">
            let embeddedQBarExperience;

            function onError(payload) {
                console.log("Do something when the session fails loading");
            }

            function onExpand() {
                console.log("Do something when the Q search bar opens");
            }

            function onCollapse() {
                console.log("Do something when the Q search bar closes");
            }

            function embedQSearchBar() {
                const containerDiv = document.getElementById("embeddingContainer");
                const options = {
                    url: "<YOUR_EMBED_URL>", // replace this value with the url generated via embedding API
                    container: containerDiv,
                    width: "1000px",
                    locale: "en-US",
                    qSearchBarOptions: {
                        expandCallback: onExpand,
                        collapseCallback: onCollapse,
                        iconDisabled: false,
                        topicNameDisabled: false, 
                        themeId: 'theme12345',
                        allowTopicSelection: true
                    }
                };
                embeddedQBarExperience = QuickSightEmbedding.embedQSearchBar(options);
                embeddedQBarExperience.on("error", onError);
            }

            function onCountryChange(obj) {
                embeddedQBarExperience.setParameters({country: obj.value});
            }
        </script>
    </head>

    <body onload="embedQSearchBar()">
        <div id="embeddingContainer"></div>
    </body>

    </html>
```

&nbsp;  
## Troubleshooting
&nbsp;  
1. Make sure the URL you provide in options is not encoded. You should avoid using an encoded URL because it breaks the authcode in the URL by changing it. Also, check that the URL sent in the response from the server side is not encoded.
2. The URL only works if it used with the authcode it came with. The URL and authcode need to be used together. They expire after five minutes, so it's worth checking that you're not troubleshooting an expired combination of URL and authcode.
2. Some browsers (e.g. mobile safari) have default setting to "Always Block Cookies". Change the setting to either "Allow form Websites I Visit" or "Always Allow".
3. Q search bar troubleshooting:
    * Shifting page contents in unwanted way - try giving the embedding container and the iframe class a style with position absolute.
    * Clicking on some parts of your application does not close the Q search bar - use the `expandCallback` and `collapseCallback` to create a backdrop/element on the page that's always clickable so that the document listener can properly close the search bar.


&nbsp;  
## License
&nbsp;  
Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0

---

💭  [Give us feedback on your QuickSight embedding experience!](https://amazonmr.au1.qualtrics.com/jfe/form/SV_82jpzFSMLDBH1K6)
