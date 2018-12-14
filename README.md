# Amazon QuickSight Embedding SDK
Thank you for using the Amazon QuickSight JavaScript SDK. You can use this SDK to embed Amazon QuickSight dashboards on HTML pages within your web applications.

## Usage
Before you can embed an Amazon QuickSight dashboard, you need to publish it and ensure that users are granted necessary permissions. For more information, see  [Embedding Amazon QuickSight Dashboards](https://docs.aws.amazon.com/en_us/quicksight/latest/user/embedding-dashboards.html) in the Amazon QuickSight User Guide..

After a dashboard is ready to be embedded, follow the steps below to embed an Amazon QuickSight dashboard in this [example](#example):

### Step 1: Download and include QuickSight Embedding SDK
Do one of the following:

-  Option 1: Use the Amazon QuickSight Embedding SDK in the browser:
```
    <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@1.0.3/dist/quicksight-embedding-js-sdk.min.js" />
```

-  Option 2: Install and use the QuickSight Embedding SDK in Node.js:
```
    npm install amazon-quicksight-embedding-sdk
```
```
    var QuickSightEmbedding = require("amazon-quicksight-embedding-sdk");
```


### Step 2: Configure the dashboard to embed
Set up the dashboard so you can embed it.
```
    var options = {
        url: "https://us-east-1.quicksight.aws.amazon.com/sn/dashboards/dashboardId?isauthcode=true&identityprovider=quicksight&code=authcode",
        container: document.getElementById("dashboardContainer"),
        parameters: {
            country: "United States"
            states: [
                "California",
                "Washington"
            ]
        },
        scrolling: "no",
        height: "700px",
        width: "1000px"
    };
```
#### Url element (required)
If you haven't done it yet, follow [Embedding Amazon QuickSight Dashboards](https://docs.aws.amazon.com/en_us/quicksight/latest/user/embedding-dashboards.html) in the Amazon QuickSight User Guide to generate the url.

#### Container element (required)
The `container` element is the parent HTMLElement where we're going to embed the dashboard. You can make it one of the following: 

-  Option 1: It can be an HTMLElement:
```
    container: document.getElementById("dashboardContainer"),
```
-  Option 2: Or, it can be a query selector string:
```
    container: "#dashboardContainer",
```

#### Parameters element (optional)
The `parameters` element is an object that contains key:value pairs for parameters names:values.
It allows you to set initial parameter values for your dashboard. Pass an array as value for multi-value parameters.
For more information about parameters in Amazon QuickSight, see https://docs.aws.amazon.com/quicksight/latest/user/parameters-in-quicksight.html

#### Scrolling element (optional)
The `scrolling` element lets you set up a specific scrolling experience for the iFrame that holds your dashboard. Available values are `auto`, `yes`,
and `no`. The default value is `no`.

#### Width element and height element (optional)
You can set `width` and `height` for the iFrame that holds your dashboard. Both of these default to 100%. You can set them to be fixed values:
```
    height: "700px",
    width: "1000px"
```

Or, relative values:
```
    height: "80%",
    width: "60%"
```

To make your embedded dashboard responsive,  don't set `width` or `height` (leave them at the default: `100%`). Then make the container HTMLElement responsive to screen size change.


You can also choose to set height to be `AutoFit` to make the iFrame fit your dashboard height. Use `loadingHeight` to specify the height you'd like to use before actual dashboard height is known:
```
    height: "AutoFit",
    loadingHeight: '700px',
```

### Step 3: Embed the dashboard

Embed the dashboard by calling:
```
    var dashboard = QuickSightEmbedding.embedDashboard(options);
```
This returns a dashboard object for further action.


### Step 4: Setup load callback (optional)

If you want your application to get notified and respond when the Amazon QuickSight dashboard is fully loaded, use a load callback. Choose one of the following:

-  Use options:
```
    loadCallback: yourLoadCallback,
```

- Or, register the "load" event on the returned dashboard object:
```
    dashboard.on("load", yourLoadCallback);
```


### Step 5: Setup error callback (optional)

If you want your application get notified and respond when QuickSight dashboard fails to load, use a error callback. Choose one of the following:

- Use options:
```
    errorCallback: yourErrorCallback,
```

- Or, register the "error" event on the returned dashboard object:
```
     dashboard.on("error", yourErrorCallback);
```

We pass a payload object to your callback function with a specific `payload.errorCode`. Currently, the error codes are:

- `Forbidden` -- the URL's authentication code expired 

- `Unauthorized` -- the session obtained from the authentication code expired

If you follow the instructions to generate the correct URL, but you still receive these error codes, you need to generate a new URL.


### Step 6: Update parameter values (optional)
Use `dashboard.setParameters()` to update parameter values. Pass an array as value for multi-value parameters.
You can build your own UI to trigger this, so that viewers of the embedded dashboard can control the dashboard from your app page.
```
    dashboard.setParameters({country: "China", states: ["Zhejiang", "Jiangsu"]});
```


## Troubleshooting
1. Make sure the url you provide in options is not encoded. Don't encode the url as it changes the authcode in the url and breaks the url. Also check that the url responded from server side is not encoded.
2. Some browsers (e.g. mobile safari) have default setting to "Always Block Cookies". Change the setting to either "Allow form Websites I Visit" or "Always Allow".


## Example
```html
    <!DOCTYPE html>
    <html>

    <head>
        <title>Basic Embed</title>
        <script src="https://unpkg.com/amazon-quicksight-embedding-sdk@1.0.3/dist/quicksight-embedding-js-sdk.min.js" />
        <script type="text/javascript">
            var dashboard
            function onDashboardLoad(payload) {
                console.log("Do something when the dashboard is fully loaded.");
            }

            function onError(payload) {
                console.log("Do something when the dashboard fails loading");
            }

            function embedDashboard() {
                var containerDiv = document.getElementById("dashboardContainer");
                var options = {
                    url: "https://us-east-1.quicksight.aws.amazon.com/sn/dashboards/dashboardId?isauthcode=true&identityprovider=quicksight&code=authcode",
                    container: containerDiv,
                    parameters: {
                        country: "United States"
                    },
                    scrolling: "no",
                    height: "700px",
                    width: "1000px"
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
        <div id="dashboardContainer"></div>
    </body>

    </html>
```

## Change Log
**1.0.3:**
* Added "AutoFit" as an new height option.

**1.0.2:**
* Added support for multi-value parameters.

**1.0.1:**
* Initial release.

## License
Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0
