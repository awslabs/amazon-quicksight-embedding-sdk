&nbsp;  
## Dashboard Embedding Options in the Version 1.x
&nbsp;  

#### 🔹 printEnabled: *boolean* *(optional, default=false)*

In the version 1.x
```javascript
    const options = {
        // ...
        printEnabled: true
    }
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        toolbarOptions: {
            export: true
        }
    };
```

#### 🔹 undoRedoDisabled: *boolean* *(optional, default=false)*

In the version 1.x
```javascript
    const options = {
        // ...
        undoRedoDisabled: true
    }
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        toolbarOptions: {
            undoRedo: false
        }
    };
```

In version 1.x, `undoRedoDisabled: true` hides the undo and redo buttons. `undoRedoDisabled: false` shows them. 

Version 2.0 introduces `undoRedo` as a replacement for `undoRedoDisabled`. The boolean logic of `undoRedo` is the reverse of the boolean logic of `undoRedoDisabled`. `undoRedo: true` shows the undo and redo buttons. `undoRedo: false` hides them. 

The default value of `undoRedo` is also `false`. 

#### 🔹 resetDisabled: *boolean* *(optional, default=false)*

In the version 1.x
```javascript
    const options = {
        // ...
        resetDisabled: true
    }
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        toolbarOptions: {
            reset: false
        }
    };
```

In version 1.x, `resetDisabled: true` hides the reset button. `resetDisabled: false` shows it. 

Version 2.0 introduces `reset` as a replacement for `resetDisabled`. The boolean logic of `reset` is the reverse of the boolean logic of `resetDisabled`. `reset: true` shows the reset button. `reset: false` hides it. 

The default value of `reset` is also `false`. 

#### 🔹 sheetId: *string* *(optional)*

In the version 1.x
```javascript
    const options = {
        // ...
        sheetId: '<YOUR_SHEET_ID>'
    }
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        sheetOptions: {
            sheetId: '<YOUR_SHEET_ID>'
        }
    };
```

#### 🔹 sheetTabsDisabled: *boolean* *(optional, default=false)*

In the version 1.x
```javascript
    const options = {
        // ...
        sheetTabsDisabled: true
    }
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        sheetOptions: {
            singleSheet: true
        }
    };
```

#### 🔹 iframeResizeOnSheetChange: *boolean* (optional default=false)

In the version 1.x
```javascript
    const options = {
        // ...
        iframeResizeOnSheetChange: true
    }
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        sheetOptions: {
            emitSizeChangedEventOnSheetChange: true
        }
    };
```

#### 🔹 footerPaddingEnabled: *boolean* *(optional, default=false)*

In the version 1.x
```javascript
    const options = {
        // ...
        footerPaddingEnabled: true
    }
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        attributionOptions: {
            overlayContent: false
        }
    };
```

In version 1.x, `footerPaddingEnabled: true` adds additional padding at the footer to prevent overlap with the content. `footerPaddingEnabled: false` allows content overlap. 

Version 2.0 introduces `overlayContent` as a replacement for `footerPaddingEnabled`. The boolean logic of `overlayContent` is the reverse of the boolean logic of `footerPaddingEnabled`. `overlayContent: false` adds additional padding at the footer to prevent overlap with the content. `overlayContent: true` allows content overlap. 

The default value of `overlayContent` is also `false`. 

#### 🔹 parametersChangeCallback: *Function* *(optional)*

In the version 1.x
```javascript
    const options = {
        // ...
        parametersChangeCallback: (data) => {
            console.log('Parameters changed', data);
            // {
            //     parameters: [
            //         {
            //             name: 'usStates',
            //             value: ['Arizona', 'Texas']
            //         }
            //     ],
            //     changedParameters: [
            //         {
            //             name: 'usStates',
            //             value: ['Arizona', 'Texas']
            //         }
            //     ]
            // }
        },
    };
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        onMessage: (messageEvent) => {
            switch(messageEvent.eventName) {
                case 'PARAMETERS_CHANGED': {
                    console.log('Parameters changed', messageEvent.message);
                    // {
                    //     changedParameters: [
                    //         {
                    //             Name: 'usStates',
                    //             Values: ['Arizona', 'Texas']
                    //         }
                    //     ]
                    // }
                    break;
                }
            }
        }
    };
```

#### 🔹 selectedSheetChangeCallback: *Function* *(optional)*

In the version 1.x
```javascript
    const options = {
        // ...
        selectedSheetChangeCallback: (data) => {
            console.log('Selected sheet changed', data);
        },
    }
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        onMessage: (messageEvent) => {
            switch(messageEvent.eventName) {
                case 'SELECTED_SHEET_CHANGED': {
                    console.log('Selected sheet changed', messageEvent.message);
                    break;
                }
            }
        }
    };
```

#### 🔹 loadCallback: *Function*  *(optional)*

In the version 1.x
```javascript
    const options = {
        // ...
        loadCallback: () => {
            console.log('Embedded content loaded');
        },
    }
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        onMessage: (messageEvent) => {
            switch(messageEvent.eventName) {
                case 'CONTENT_LOADED': {
                    console.log('Embedded content loaded', messageEvent.message);
                    break;
                }
            }
        }
    };
```

&nbsp;  
## Dashboard Embedding Actions in the Version 1.x
&nbsp;  

#### 🔹 navigateToDashboard

In the version 1.x
```javascript
    embeddedDashboardExperience.navigateToDashboard({
        dashboardId: '<NEW_DASHBOARD_ID>',
        parameters: [
            // ...
        ]
    });
```

In the version 2.0
```javascript
    const ack = await embeddedDashboardExperience.navigateToDashboard('<NEW_DASHBOARD_ID>', {
        parameters: [
            // ...
        ]
    });
```

#### 🔹 navigateToSheet

In the version 1.x
```javascript
    embeddedDashboardExperience.navigateToSheet('<NEW_SHEET_ID>');
```

In the version 2.0
```javascript
    const ack = await embeddedDashboardExperience.setSelectedSheetId('<NEW_SHEET_ID>');
```

#### 🔹 getSheets

In the version 1.x
```javascript
    embeddedDashboardExperience.getSheets((data) => {
        console.log('Sheets:', data);
    });
```

In the version 2.0
```javascript
    const sheets = await embeddedDashboardExperience.getSheets();
    console.log('Sheets:', sheets);
```

#### 🔹 initiatePrint

In the version 1.x
```javascript
    embeddedDashboardExperience.initiatePrint();
```

In the version 2.0
```javascript
    const ack = await embeddedDashboardExperience.initiatePrint();
```

#### 🔹 getActiveParameterValues

In the version 1.x
```javascript
    embeddedDashboardExperience.getActiveParameterValues((data) => {
        console.log('Parameters:', data);
        // {
        //     parameters: [
        //         {
        //             name: 'usStates',
        //             value: ['Arizona', 'Texas']
        //         },
        //         {
        //             name: 'usPartyAffiliations',
        //             value: ['Democrat', 'Republican']
        //         }
        //     ]
        // }
    });
```

In the version 2.0
```javascript
    const parameters = await embeddedDashboardExperience.getParameters();
    console.log('Parameters:', parameters);
    // [
    //     {
    //         Name: 'usStates',
    //         Values: ['Arizona', 'Texas']
    //     },
    //     {
    //         Name: 'usPartyAffiliations',
    //         Values: ['Democrat', 'Republican']
    //     }
    // ]
```

&nbsp;  
## Visual Embedding Options in the Version 1.x
&nbsp;    

#### 🔹 parametersChangeCallback: *Function* *(optional)*

In the version 1.x
```javascript
    const options = {
        // ...
        parametersChangeCallback: (data) => {
            console.log('Parameters changed', data);
            // {
            //     parameters: [
            //         {
            //             name: 'usStates',
            //             value: ['Arizona', 'Texas']
            //         }
            //     ],
            //     changedParameters: [
            //         {
            //             name: 'usStates',
            //             value: ['Arizona', 'Texas']
            //         }
            //     ]
            // }
        },
    };
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        onMessage: (messageEvent) => {
            switch(messageEvent.eventName) {
                case 'PARAMETERS_CHANGED': {
                    console.log('Parameters changed', messageEvent.message);
                    // {
                    //     changedParameters: [
                    //         {
                    //             Name: 'usStates',
                    //             Values: ['Arizona', 'Texas']
                    //         }
                    //     ]
                    // }
                    break;
                }
            }
        }
    };
```

#### 🔹 loadCallback: *Function* *(optional)*

In the version 1.x
```javascript
    const options = {
        // ...
        loadCallback: () => {
            console.log('Embedded content loaded');
        },
    };
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        onMessage: (messageEvent) => {
            switch(messageEvent.eventName) {
                case 'CONTENT_LOADED': {
                    console.log('Embedded content loaded', messageEvent.message);
                    break;
                }
            }
        }
    };
```

&nbsp;  
## Visual Embedding Actions in the Version 1.x
&nbsp;  

#### 🔹 getActiveParameterValues

In the version 1.x
```javascript
    embeddedDashboardExperience.getActiveParameterValues((data) => {
        console.log('Parameters:', data);
        // {
        //     parameters: [
        //         {
        //             name: 'usStates',
        //             value: ['Arizona', 'Texas']
        //         },
        //         {
        //             name: 'usPartyAffiliations',
        //             value: ['Democrat', 'Republican']
        //         }
        //     ]
        // }
    });
```

In the version 2.0
```javascript
    const parameters = await embeddedDashboardExperience.getParameters();
    console.log('Parameters:', parameters);
    // [
    //     {
    //         Name: 'usStates',
    //         Values: ['Arizona', 'Texas']
    //     },
    //     {
    //         Name: 'usPartyAffiliations',
    //         Values: ['Democrat', 'Republican']
    //     }
    // ]
```

&nbsp;  
## QSearchBar Embedding Options in the Version 1.x
&nbsp;  

#### 🔹 topicNameDisabled: *boolean* *(optional, default=false)*

In the version 1.x
```javascript
    const options = {
        // ...
        qSearchBarOptions: {
            topicNameDisabled: false
        }
    };
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        hideTopicName: false
    };
```

#### 🔹 themeId: *string* *(optional)*

In the version 1.x
```javascript
    const options = {
        // ...
        qSearchBarOptions: {
            themeId: '<YOUR_THEME_ID>'
        }
    };
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        theme: '<YOUR_THEME_ID>'
    };
```

#### 🔹 allowTopicSelection: *boolean* *(optional)*

In the version 1.x
```javascript
    const options = {
        // ...
        qSearchBarOptions: {
            allowTopicSelection: true
        }
    };
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        allowTopicSelection: true
    };
```

#### 🔹 expandCallback: *Function* *(optional)*

In the version 1.x
```javascript
    const options = {
        // ...
        qSearchBarOptions: {
            expandCallback: (data) => {
                console.log('Q search bar expanded', data);
            },
        }
    }
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        onMessage: (messageEvent) => {
            switch(messageEvent.eventName) {
                case 'Q_SEARCH_OPENED': {
                    console.log('Q search bar expanded', messageEvent.message);
                    break;
                }
            }
        }
    };
```

#### 🔹 collapseCallback: *Function* *(optional)*

In the version 1.x
```javascript
    const options = {
        // ...
        qSearchBarOptions: {
            collapseCallback: (data) => {
                console.log('Q search bar collapsed', data);
            },
        }
    }
```

In the version 2.0
```javascript
    const frameOptions = {
        // ...
    };
    const contentOptions = {
        // ...
        onMessage: (messageEvent) => {
            switch(messageEvent.eventName) {
                case 'Q_SEARCH_CLOSED': {
                    console.log('Q search bar collapsed', messageEvent.message);
                    break;
                }
            }
        }
    }
```

&nbsp;  
## QSearchBar Embedding Actions in the Version 1.x
&nbsp;  

#### 🔹 setQBarQuestion

In the version 1.x
```javascript
    embeddedQBarExperience.setQBarQuestion('show me monthly revenue');
```

In the version 2.0
```javascript
    const ack = await embeddedQBarExperience.setQuestion('show me monthly revenue');
```

#### 🔹 closeQPopover

In the version 1.x
```javascript
    embeddedQBarExperience.closeQPopover();
```

In the version 2.0
```javascript
    const ack = await embeddedQBarExperience.close();
```
