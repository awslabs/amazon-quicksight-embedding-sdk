## Amazon QuickSight Embedding SDK for JavaScript
An SDK to help users embed QuickSight dashboards on their own pages.

## Example
```html
    <!DOCTYPE html>
    <html>

    <head>
        <title>Basic Embed</title>
        <script type="text/javascript" src="https://public.end.point/quicksight-embedding-sdk.min.js"></script>
        <script type="text/javascript">
            function embedDashboard() {
                var containerDiv = document.getElementById("dashboardContainer");
                var params = {
                    url: "https://us-east-1.quicksight.aws.amazon.com/sn/dashboards/2a8c5f05-e969-4dc2-b606-aab5c086c239",
                    container: containerDiv,
                    parameters: {
                        country: 'United States'
                    },
                    height: "700px",
                    width: "1000px"
                };
                var dashboard = QuickSightEmbedding.embedDashboard(params);
                dashboard.on('error', function() {});
                dashboard.on('load', function() {});
                dashboard.setParameters({country: 'Canada'});
            }
        </script>

    </head>

    <body onload="embedDashboard()">
        <div id="dashboardContainer"></div>
    </body>

    </html>
```

## License
Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.
SPDX-License-Identifier: Apache-2.0