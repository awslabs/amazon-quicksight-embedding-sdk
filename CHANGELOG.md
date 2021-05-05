**1.0.13**
* `initiatePrint` function for printing a dashboard from parent website, without need for navbar print icon.
* Bugfix: when `printEnabled` is false, will not show print icon in dashboard navbar.
* Updated ini from 1.3.5 to 1.3.8 for a security fix.

**1.0.12**
* `navigateToDashboard` function for switching to another authorized dashboard without submitting a new URL
* `navigateToSheet` function for switching to another sheet on an already embedded dashboard
* `parametersChangeCallback` option to receive a callback when changing parameters in dashboard
* `selectedSheetChangeCallback` option to receive a callback when sheet is successfully changed on the embedded dashboard
* `getSheets` function to get list of sheets on currently rendered dashboard in ad-hoc manner
* `getActiveParameterValues` function to get currently applied parameters in ad-hoc manner
* `printEnabled` option to add a Print button for embedded dashboard
* `sheetTabsDisabled` option to disable tabs display on a multi-sheet embedded dashboard

**1.0.11**
* Fixed dashboard embedding issue in IE11
* Updated elliptic to 6.5.3 to resolve security issues
* Fixed serialize-javascript vulnerability

**1.0.9**
* Added support for session embedding
* Added option for default visual type for session embedding
* Updated Babel to the latest version

**1.0.7**
* Added option to enable footer padding.

**1.0.6**
* Supported setting locale.

**1.0.5**
* Fixed compatibility with IE 11 when updating parameter values.
* Improved README.

**1.0.4**
* Added SHOW_MODAL_EVENT to notify modal is shown in Dashboard.

**1.0.3:**
* Added "AutoFit" as a new height option.

**1.0.2:**
* Added support for multi-value parameters.

**1.0.1:**
* Initial release.
