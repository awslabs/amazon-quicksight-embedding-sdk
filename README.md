# Amazon QuickSight Embedding SDK
Thank you for using the Amazon QuickSight JavaScript SDK. You can use this SDK to embed Amazon QuickSight in your HTML.

## Usage
Amazon QuickSight offers three different embedded experiences with options for branding, user isolation with namespaces, and custom UI permissions:

* Embedded authoring portals provide the QuickSight authoring experience

To get started with an embedded authoring portal, you need to make sure that the users are granted the necessary permissions. For more information, see [Embedding the Amazon QuickSight Console](https://docs.aws.amazon.com/en_us/quicksight/latest/user/embedding-quicksight-console.html)

* Embedded dashboards provide an interactive read-only experience

To get started with an embedded dashboard, you need to publish it and also make sure that the users have the necessary permissions. For more information, see  [Embedding Amazon QuickSight Dashboards](https://docs.aws.amazon.com/en_us/quicksight/latest/user/embedding-dashboards.html) in the Amazon QuickSight User Guide. After a dashboard is ready, follow the procedure to embed your Amazon QuickSight dashboard in this [example](#example):

* Embedded Q Search Bar provides the [QuickSight Q](https://aws.amazon.com/quicksight/q/) search bar experience

To get started with an embedded Q search bar, you need to create topics and also make sure that the users have the necessary permissions. For more information, see  [Embedding Amazon QuickSight Q Search Bar](https://docs.aws.amazon.com/en_us/quicksight/latest/user/embedding-q-search-bar.html) in the Amazon QuickSight User Guide. After Q is ready, follow the procedure to embed your Amazon QuickSight Q search bar in this [example](#example):

### Setup differences between embedded QuickSight experiences: dashboards and portals
The process to set up QuickSight embedding is similar in both cases. The differences between setting up the two embedded experiences are as follows:

 1. You use a different SDK object for each embedded QuickSight experience. You use `embedDashboard` to embed a dashboard, `embedQSearchBar` to embed the Q search bar, and you use `embedSession` to embed an authoring portal.
 2. You use a different API for each embedded experience. For more information, see [QuickSight Embedding APIs](https://docs.aws.amazon.com/en_us/quicksight/latest/APIReference/embedding-quicksight.html)
 3. Different options are supported for each embedded experience.
 * Embedded dashboards are always read-only. The level of interactivity is set when the dashboard is published.
 * Embedded authoring ports allow the user to create QuickSight assets, just like they can in the AWS console for QuickSight. Exactly what the user can do in the console is controlled by a custom permission profile. The profile can remove abilities such as creating or updating data sources and datasets. You can set also the default visual type. Embedded consoles currently don't support screen scaling in formatting options.

 Details for each option are provided below in [step 2](#Step-2:-Configure-embedding)

### Step 1: Download and include QuickSight Embedding SDK
Do ONE of the following:

-  Option 1: Use the Amazon QuickSight Embedding SDK in the browser:
```html
    <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@1.19.0/dist/quicksight-embedding-js-sdk.min.js"></script>
```
*OR*
-  Option 2: Install and use the QuickSight Embedding SDK in Node.js:
```shell
    npm install amazon-quicksight-embedding-sdk
```
```javascript
    var QuickSightEmbedding = require("amazon-quicksight-embedding-sdk");
```
You can also use ES6 import syntax in place of require:

#### For the embedded dashboard experience
```javascript
    import { embedDashboard } from 'amazon-quicksight-embedding-sdk';

    const dashboard = embedDashboard(options);
```
Alternatively, if you need to load the entire module:
```javascript
    import * as QuickSightEmbedding from 'amazon-quicksight-embedding-sdk';

    const dashboard = QuickSightEmbedding.embedDashboard(options);
```
#### For the embedded console experience (authoring portals)
You can also use ES6 import syntax in place of require:
```javascript
    import { embedSession } from 'amazon-quicksight-embedding-sdk';

    const session = embedSession(options);
```
Alternatively, if you need to load the entire module:
```javascript
    import * as QuickSightEmbedding from 'amazon-quicksight-embedding-sdk';

    const session = QuickSightEmbedding.embedSession(options);
```

#### For the embedded Q search bar experience 
You can also use ES6 import syntax in place of require:
```javascript
    import { embedQSearchBar } from 'amazon-quicksight-embedding-sdk';

    const session = embedQSearchBar(options);
```
Alternatively, if you need to load the entire module:
```javascript
    import * as QuickSightEmbedding from 'amazon-quicksight-embedding-sdk';

    const session = QuickSightEmbedding.embedQSearchBar(options);
```

### Step 2: Configure embedding
Set up the embedded QuickSight console options.
```javascript
    var options = {
        url: "https://us-east-1.quicksight.aws.amazon.com/sn/dashboards/dashboardId?isauthcode=true&identityprovider=quicksight&code=authcode",
        container: document.getElementById("embeddingContainer"),
        parameters: {
            country: "United States",
            states: [
                "California",
                "Washington"
            ]
        },
        scrolling: "no",
        height: "700px",
        iframeResizeOnSheetChange: false, // use this option in combination with height: AutoFit, to allow iframe height to resize dynamically, based on sheet height, on changing sheets.
        width: "1000px",
        locale: "en-US",
        footerPaddingEnabled: true,
        sheetId: 'YOUR_SHEETID' // use this option to specify initial sheet id to load for the embedded dashboard
        sheetTabsDisabled: false, // use this option to enable or disable sheet tab controls in dashboard embedding
        printEnabled: false, // use this option to enable or disable print option for dashboard embedding
        undoRedoDisabled: false, // set this option to true to disable undo and redo buttons for dashboard embedding
        resetDisabled: false, // set this option to true to disable reset button for dashboard embedding
        defaultEmbeddingVisualType: TABLE // this option only applies to experience embedding and will not be used for dashboard embedding
    };
```
#### URL element (required)
If you haven't done it yet, to generate the embedding URL for dashboard embedding, follow [Embedding Amazon QuickSight Dashboards](https://docs.aws.amazon.com/en_us/quicksight/latest/user/embedding-dashboards.html) in the Amazon QuickSight User Guide to generate the url.

To generate the embedding URL for console embedding, follow [Embedding the Amazon QuickSight Console](https://docs.aws.amazon.com/en_us/quicksight/latest/user/embedding-the-quicksight-console.html) in the Amazon QuickSight User Guide to generate the URL.

#### Container element (required)
The `container` element is the parent HTMLElement where we're going to embed QuickSight. You can make it one of the following:

-  Option 1: It can be an HTMLElement:
```javascript
    container: document.getElementById("embeddingContainer")
```
-  Option 2: Or, it can be a query selector string:
```javascript
    container: "#embeddingContainer"
```

#### Parameters element (optional)
The `parameters` element is an object that contains key:value pairs for parameters names:values.
It allows you to set initial parameter values for your embedded QuickSight session. Pass an array as value for multi-value parameters.
For more information about parameters in Amazon QuickSight, see https://docs.aws.amazon.com/quicksight/latest/user/parameters-in-quicksight.html

#### Scrolling element (optional)
The `scrolling` element lets you set up a specific scrolling experience for the iFrame that holds your embedded QuickSight session. Available values are `auto`, `yes`,
and `no`. The default value is `no`.

#### Width element and height element (optional)
You can set `width` and `height` for the iFrame that holds your embedded QuickSight session. Both of these default to 100%. You can set them to be fixed values:
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


You can also choose to set height to be `AutoFit` to make the iFrame fit your dashboard height. Use `loadingHeight` to specify the height you'd like to use before actual dashboard height is known. **This is currently only supported for dashboard embedding**:
```javascript
    height: "AutoFit",
    loadingHeight: "700px"
```

Note: With AutoFit height enabled, modals generated by the dashboard can be hidden
if the content is larger than the screen. An example of this type of modal is the one that displays when you select "Export to CSV" on a Table visual. To solve this issue, you can add the following code to autoscroll the focus to the modal.
```javascript
dashboard.on("SHOW_MODAL_EVENT", () => {
    window.scrollTo({
        top: 0 // iFrame top position
    });
});
```

#### IframeResizeOnSheetChange element (optional)
You can use `iframeResizeOnSheetChange` option in combination with `height: "AutoFit"` option, when you want the embedded dashboard height to auto resize based on sheet height, on every sheet change event. The default value is `false`.

#### SheetId element (optional)
You can use the `sheetId` option, when you want to specify the initial sheet of the dashboard, instead of loading the first sheet of the embedded dashboard. You can provide the target sheet id of the dashboard as the value. In case the sheet id value is invalid, the first sheet of the dashboard will be loaded.

#### ClassName element (optional)
You can customize style of the iFrame that holds your dashboard by one of the followings:

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

We've overridden the border and padding of the iFrame to be 0px, because setting border and padding on the iFrame might cause unexpected issues. If you have to set border and padding on the embedded QuickSight session, set it on the container div that contains the iFrame.

Note for Q search bar embedding, you'll likely want to use this to give the iframe a `position: absolute` so that when expanded it does not shift the contents of your application. If elements in your application are appearing in front of the Q search bar, you can provide the iframe with a higher z-index as well. 

#### Locale element (optional)
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
ko-KR (한국어),
zh-CN (中文 (简体)),
zh-TW (中文 (繁體))
```
Note: The above list might be out of date, as we continue adding more locales to QuickSight. For a more updated list of locales, please refer to https://docs.aws.amazon.com/quicksight/latest/user/choosing-a-language-in-quicksight.html. Any unsupported locale value will fallback to using en-US.

#### DefaultEmbeddingVisualType for QuickSight console embedding (optional)
You can set the embedding visual type for embedded sessions. The default visual type provided in the options will be used during visual creating. By default, when you add a new visual in an embedded session, `AutoGraph` is selected by default. This setting can be overridden to `Table` by setting the following option:
```
    defaultEmbeddingVisualType: "TABLE"
```

Available options for default visual types in embedding are:
```
AUTO_GRAPH,
TABLE
```

#### FooterPaddingEnabled element (optional)
The `footerPaddingEnabled` element adds 22 pixels of space at the bottom of the layout. For example, you can set this to `true` if the "Powered by QuickSight" footer blocks part of your visual. The default value is `false`.

#### PrintEnabled element (optional)
The `printEnabled` element can be used to enable or disable print option for dashboard embedding. The default value is `false`. And, if both undoRedo and reset options are disabled, the navbar and print option wont be shown anyways, even if printEnabled is true.

#### UndoRedoDisabled element (optional)
The `undoRedoDisabled` element can be used to disable undo and redo buttons for dashboard embedding. If this option is set to `true`, the undo redo buttons will not be shown. The default value is `false`.

#### ResetDisabled element (optional)
The `resetDisabled` element can be used to disable reset button for dashboard embedding. If this option is set to `true`, the reset button will not be shown. The default value is `false`.

#### SheetTabsDisabled element (optional)
**This is currently only supported for dashboard embedding.**
The `sheetTabsDisabled` element can be used to enable or disable sheet tab controls in dashboard embedding. The default value is `false`.

### Q Search Bar options
The `qSearchBarOptions` object is to specify Q specific options when embedding:
```javascript
    var qSearchBarOptions = {
        expandCallback: () => {},
        collapseCallback: () => {},
        iconDisabled: false,
        topicNameDisabled: false, 
        themeId: 'theme12345',
        allowTopicSelection: true
    };
```

#### ExpandCallback (optional)
The `expandCallback` in `qSearchBarOptions` can be used to specify behavior for your application when the Q search bar is expanded (clicked into).

#### CollapseCallback (optional)
The `collapseCallback` in `qSearchBarOptions` can be used to specify behavior for your application when the Q search bar is collapsed (clicked out of).

#### IconDisabled (optional)
The `iconDisabled` element in `qSearchBarOptions` can be used to customize whether or not the QuickSight Q icon appears in the embedded search bar. The default value is `false`.

#### TopicNameDisabled (optional)
The `topicNameDisabled` element in `qSearchBarOptions` can be used to customize whether or not the QuickSight Q Topic name appears in the embedded search bar. The default value is `false`.

#### ThemeId (optional)
The `themeId` element in `qSearchBarOptions` can be used to set a content theme for the embedded search bar. Note that the embedded QuickSight user, or the group or namespace they belong to, must have permissions on this theme. The default theme is the default QuickSight theme seen in the console application. 

#### AllowTopicSelection (optional)
The `allowTopicSelection` element in `qSearchBarOptions` can be used to customize whether or not the embedded user can change the selected topic for the Q search bar. Note that this can only be set to false if the `initialTopicId` was specified in the embedding API; for more information, see [QuickSight Embedding APIs](https://docs.aws.amazon.com/en_us/quicksight/latest/APIReference/embedding-quicksight.html). The default value is `true`.

### Step 3: Create the QuickSight session object

#### Dashboard embedding
```javascript
    var dashboard = QuickSightEmbedding.embedDashboard(options);
```
This returns a dashboard object for further action.

#### Console embedding
```javascript
    var session = QuickSightEmbedding.embedSession(options);
```
This returns an console session object for further action.

#### QSearchBar embedding
```javascript
    var qBar = QuickSightEmbedding.embedQSearchBar(options);
```
This returns a Q search bar object for further action.

### Step 4: Setup load callback (optional)
**This is currently only supported for dashboard embedding.**

If you want your application to get notified and respond when the Amazon QuickSight dashboard is fully loaded, use a load callback. Choose one of the following:

-  Use options:
```javascript
    loadCallback: yourLoadCallback,
```

- Or, register the "load" event on the returned dashboard object:
```javascript
    dashboard.on("load", yourLoadCallback);
```


### Step 5: Setup error callback (optional)

If you want your application get notified and respond when the embedded QuickSight session fails to load, use a error callback. Choose one of the following:

- Use options:
```javascript
    errorCallback: yourErrorCallback,
```

- Or, register the "error" event on the returned dashboard object:
```javascript
     dashboard.on("error", yourErrorCallback);
```

- To register the "error" event on the returned console session object:
```javascript
     session.on("error", yourErrorCallback);
```

We pass a payload object to your callback function with a specific `payload.errorCode`. Currently, the error codes are:

- `Forbidden` -- the URL's authentication code expired

- `Unauthorized` -- the session obtained from the authentication code expired

If you follow the instructions to generate the correct URL, but you still receive these error codes, you need to generate a new URL.


### Step 6: Update parameter values (optional)
Use `setParameters()` to update parameter values. Pass an array as value for multi-value parameters.
You can build your own UI to trigger this, so that viewers of the embedded QuickSight session can control it from your app page.

#### Dashboard embedding
Parameters in an embedded dashboard session can be set by using the following call:
```javascript
    dashboard.setParameters({country: "United States", states: ["California", "Washington"]});
```

To reset a parameter so that it includes all values, you can pass the string `"[ALL]"`.
```javascript
    dashboard.setParameters({country: "United States", states: "[ALL]" });
```

#### Console embedding
Parameters in an embedded console session can be set by using the following call:
```javascript
    session.setParameters({country: "United States", states: ["California", "Washington"]});
```

To reset a parameter so that it includes all values, you can pass the string `"[ALL]"`.
```javascript
    session.setParameters({country: "United States", states: "[ALL]" });
```


### Step 7: Navigate to different dashboard (optional)
#### Dashboard embedding

To navigate to a different dashboard, use dashboard.navigateToDashboard(options). The input parameter options should contain the dashboardId that you want to navigate to, and also the parameters for that dashboard, for example:
```javascript
    var options = {
        dashboardId: "37a99f75-8230-4409-ac52-e45c652cc21e",
        parameters: {
            country: [
                "United States"
            ]
        }
    };
    dashboard.navigateToDashboard(options);
```
This function is only supported for embedded dashboards.

### Step 8: Navigate to sheet (optional)
**This is currently only supported for dashboard embedding.**

If you want to navigate from one sheet to another programmatically, with the Amazon quicksight dashboard, use the below method:

```javascript
    dashboard.navigateToSheet(sheetId);
```

### Step 9: Setup parameters change callback (optional)
**This is currently only supported for dashboard embedding.**

If you want your application to get notified and respond when the parameters in Amazon QuickSight dashboard changes, use the parameter change callback. Choose one of the following:

-  Use options:
```javascript
    parametersChangeCallback: yourParametersChangeCallback,
```

- Or, register the "parametersChange" event on the returned dashboard object:
```javascript
    dashboard.on("parametersChange", yourParametersChangeCallback);
```

### Step 10: Setup selected sheet change callback (optional)
**This is currently only supported for dashboard embedding.**

If you want your application to get notified and respond when the selected sheet in Amazon QuickSight dashboard changes, use the selected sheet change callback. Choose one of the following:

-  Use options:
```javascript
    selectedSheetChangeCallback: yourSelectedSheetChangeCallback,
```

- Or, register the "selectedSheetChange" event on the returned dashboard object:
```javascript
    dashboard.on("selectedSheetChange", yourSelectedSheetChangeCallback);
```

### Step 11: Get active parameter values (optional)
**This is currently only supported for dashboard embedding.**

If you want to get the active parameter values, from Amazon Quicksight dashboard in ad-hoc manner, use the below method with a callback:

```javascript
    dashboard.getActiveParameterValues(yourCallback);
```

The callback is needed since the process of getting active parameter values is asynchronous, even for ad-hoc fetches.

### Step 12: Get sheets (optional)
**This is currently only supported for dashboard embedding.**

If you want to get the current set of sheets, from Amazon Quicksight dashboard in ad-hoc manner, use the below method with a callback:

```javascript
    dashboard.getSheets(yourCallback);
```

The callback is needed since the process of getting sheets is asynchronous, even for ad-hoc fetches.

### Step 13: Initiate print from JS SDK method
**This is currently only supported for dashboard embedding.**

This feature allows you to initiate dashboard print, from parent website, without a navbar print icon, in the dashboard. To initiate a dashboard print from parent website, use dashboard.initiatePrint(), for example:
```javascript
    dashboard.initiatePrint();
```

### Step 14: Invoke Q search bar actions (optional)
**These are only supported for Q search bar embedding.**

#### Set Q search bar question

This feature sends a question to the Q search bar and immediately queries the question. It also automatically opens the Q popover.

```javascript
    qBar.setQBarQuestion('show me monthly revenue');
```


#### Close Q popover

This feature closes the Q popover, returns the iframe to the original Q search bar size.

```javascript
    qBar.closeQPopover();
```


## Troubleshooting
1. Make sure the URL you provide in options is not encoded. You should avoid using an encoded URL because it breaks the authcode in the URL by changing it. Also, check that the URL sent in the response from the server side is not encoded.
2. The URL only works if it used with the authcode it came with. The URL and authcode need to be used together. They expire after five minutes, so it's worth checking that you're not troubleshooting an expired combination of URL and authcode.
2. Some browsers (e.g. mobile safari) have default setting to "Always Block Cookies". Change the setting to either "Allow form Websites I Visit" or "Always Allow".
3. Q search bar troubleshooting:
    * Shifting page contents in unwanted way - try giving the embedding container and the iframe class a style with position absolute.
    * Clicking on some parts of your application does not close the Q search bar - use the `expandCallback` and `collapseCallback` to create a backdrop/element on the page that's always clickable so that the document listener can properly close the search bar. 


## Example
### Dashboard embedding
```html
    <!DOCTYPE html>
    <html>

    <head>
        <title>Basic Embed</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@1.19.0/dist/quicksight-embedding-js-sdk.min.js"></script>
        <script type="text/javascript">
            var dashboard
            function onDashboardLoad(payload) {
                console.log("Do something when the dashboard is fully loaded.");
            }

            function onError(payload) {
                console.log("Do something when the dashboard fails loading");
            }

            function embedDashboard() {
                var containerDiv = document.getElementById("embeddingContainer");
                var options = {
                    url: "https://us-east-1.quicksight.aws.amazon.com/sn/dashboards/dashboardId?isauthcode=true&identityprovider=quicksight&code=authcode",
                    container: containerDiv,
                    parameters: {
                        country: "United States"
                    },
                    scrolling: "no",
                    height: "700px",
                    width: "1000px",
                    locale: "en-US",
                    footerPaddingEnabled: true
                };
                dashboard = QuickSightEmbedding.embedDashboard(options);
                dashboard.on("error", onError);
                dashboard.on("load", onDashboardLoad);
            }

            function onCountryChange(obj) {
                dashboard.setParameters({country: obj.value});
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

### QuickSight console embedding
```html
    <!DOCTYPE html>
    <html>

    <head>
        <title>QuickSight Console Embedding</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@1.19.0/dist/quicksight-embedding-js-sdk.min.js"></script>
        <script type="text/javascript">
            var session

            function onError(payload) {
                console.log("Do something when the session fails loading");
            }

            function embedSession() {
                var containerDiv = document.getElementById("embeddingContainer");
                var options = {
                    url: "https://us-east-1.quicksight.aws.amazon.com/sn/dashboards/dashboardId?isauthcode=true&identityprovider=quicksight&code=authcode", // replace this dummy url with the one generated via embedding API
                    container: containerDiv,
                    parameters: {
                        country: "United States"
                    },
                    scrolling: "no",
                    height: "700px",
                    width: "1000px",
                    locale: "en-US",
                    footerPaddingEnabled: true,
                    defaultEmbeddingVisualType: "TABLE", // this option only applies to QuickSight console embedding and is not used for dashboard embedding
                };
                session = QuickSightEmbedding.embedSession(options);
                session.on("error", onError);
            }

            function onCountryChange(obj) {
                session.setParameters({country: obj.value});
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

### QuickSight Q search bar embedding
```html
    <!DOCTYPE html>
    <html>

    <head>
        <title>QuickSight Q Search Bar Embedding</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@1.19.0/dist/quicksight-embedding-js-sdk.min.js"></script>
        <script type="text/javascript">
            var session

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
                var containerDiv = document.getElementById("embeddingContainer");
                var options = {
                    url: "https://us-east-1.quicksight.aws.amazon.com/sn/dashboards/dashboardId?isauthcode=true&identityprovider=quicksight&code=authcode", // replace this dummy url with the one generated via embedding API
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
                session = QuickSightEmbedding.embedQSearchBar(options);
                session.on("error", onError);
            }

            function onCountryChange(obj) {
                session.setParameters({country: obj.value});
            }
        </script>
    </head>

    <body onload="embedQSearchBar()">
        <div id="embeddingContainer"></div>
    </body>

    </html>
```

## License
Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0

---

💭  [Give us feedback on your QuickSight embedding experience!](https://amazonmr.au1.qualtrics.com/jfe/form/SV_82jpzFSMLDBH1K6)
