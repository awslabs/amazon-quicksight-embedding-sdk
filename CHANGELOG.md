**1.19.0**
* Add `closeQPopover` function to close the Q popover
* Add `setQBarQuestion` function to send and query a question in Q search bar
* Upgrade dependency packages

**1.18.1**
* Minor bug fixes
 * Allow special character usage in setParameter

**1.18.0** 
* Initial release of Q search bar embedding support
  * Added new set of options for QSearchBar

**1.17.2**
* Upgrading dependency packages

**1.17.1** 
* Minor bug fixes
  * Eliminate usage of eval in non-minified js file
  * Change version numbering to match semantic versioning convention

**1.0.17**
* Upgrading dependency packages
* Minor bug fixes
  * Add dashboardId into EmbeddingOptions type
  * Return after setting timer when contentWindow is not ready

**1.0.16**
* Adding undoRedoDisabled and resetDisabled flags to JS SDK

**1.0.15**
* Adding more locales list supported by QuickSight to README
* Github security fix for y18n package
* Moving changelog to separate file
* Adding embedding experience feedback link to README
* Passing initial sheetId, to load in embedded dashboard
* Option to resize iframe based on sheet size
* Error callbacks for URL expiry, Dashboard not found, Dashboard access restricted cases
* Passing info on which parameter changed, for parametersChangeCallback

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