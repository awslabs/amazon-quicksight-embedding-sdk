// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {Parameter, ParametersAsObject} from '../../common';
import {DashboardExperienceFrame} from './frame/dashboard-experience-frame';
import {
    DashboardContentOptions,
    ExportToolbarOption,
    IDashboardExperience,
    InternalDashboardExperience,
    NavigateToDashboardOptions,
    Sheet,
    TransformedDashboardContentOptions,
    Visual,
    VisualAction,
} from './types';
import {ExperienceType, FrameOptions} from '../base-experience';
import {ControlOptions} from '../control-experience';

import {ExperienceFrameMetadata} from '../../common/embedding-context';
import {BaseExperience} from '@experience/base-experience/base-experience';
import {ChangeEvent, EmbeddingMessageEvent, ResponseMessage} from '@common/events/events';
import {ChangeEventLevel, ChangeEventName, EmbeddingEvents, MessageEventName} from '@common/events/types';
import type {FilterGroup, ThemeConfiguration} from '@aws-sdk/client-quicksight';

export class DashboardExperience extends BaseExperience<
    DashboardContentOptions,
    InternalDashboardExperience,
    IDashboardExperience,
    TransformedDashboardContentOptions,
    DashboardExperienceFrame
> {
    protected readonly experience;
    protected readonly internalExperience;
    protected readonly experienceFrame;
    protected readonly experienceId: string;

    constructor(
        frameOptions: FrameOptions,
        contentOptions: DashboardContentOptions,
        controlOptions: ControlOptions,
        experienceIdentifiers: Set<string>
    ) {
        super(frameOptions, contentOptions, controlOptions, experienceIdentifiers);

        this.experience = this.extractExperienceFromUrl(frameOptions.url);

        const {experienceIdentifier, internalExperience} = this.getInternalExperienceInfo<
            InternalDashboardExperience,
            IDashboardExperience
        >(this.experience);

        this.internalExperience = internalExperience;
        this.experienceId = experienceIdentifier;

        this.experienceFrame = new DashboardExperienceFrame(
            frameOptions,
            controlOptions,
            contentOptions,
            this.transformDashboardContentOptions(contentOptions),
            internalExperience,
            experienceIdentifier,
            this.interceptMessage
        );
    }

    initiatePrint = async (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.INITIATE_PRINT));
    };

    undo = async (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.UNDO));
    };

    redo = async (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.REDO));
    };

    toggleExecutiveSummaryPane = async (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.TOGGLE_EXECUTIVE_SUMMARY_PANE));
    };

    toggleBookmarksPane = async (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.TOGGLE_BOOKMARKS_PANE));
    };

    toggleThresholdAlertsPane = async (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.TOGGLE_THRESHOLD_ALERTS_PANE));
    };

    toggleSchedulingPane = async (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.TOGGLE_SCHEDULING_PANE));
    };

    toggleRecentSnapshotsPane = async (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.TOGGLE_RECENT_SNAPSHOTS_PANE));
    };

    getParameters = async (): Promise<Parameter[]> => {
        const response = await this.send<Parameter[]>(new EmbeddingMessageEvent(MessageEventName.GET_PARAMETERS));

        if (!Array.isArray(response?.message)) {
            throw new Error('Failed to retrieve the parameters');
        }

        return response.message;
    };

    getSheets = async (): Promise<Sheet[]> => {
        const response = await this.send<Sheet[]>(new EmbeddingMessageEvent(MessageEventName.GET_SHEETS));

        if (!Array.isArray(response?.message)) {
            throw new Error('Failed to retrieve the sheets');
        }

        return response.message;
    };

    addFilterGroups = async (filterGroups: FilterGroup[]): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.ADD_FILTER_GROUPS, filterGroups));
    };

    updateFilterGroups = async (filterGroups: FilterGroup[]): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.UPDATE_FILTER_GROUPS, filterGroups));
    };

    removeFilterGroups = async (filterGroups: FilterGroup[] | string[]): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.REMOVE_FILTER_GROUPS, filterGroups));
    };

    getFilterGroupsForSheet = async (sheetId: string): Promise<FilterGroup[]> => {
        const response = await this.send<FilterGroup[]>(
            new EmbeddingMessageEvent(MessageEventName.GET_FILTER_GROUPS_FOR_SHEET, {
                SheetId: sheetId,
            })
        );

        if (!Array.isArray(response?.message)) {
            throw new Error('Failed to retrieve filter groups for the sheet');
        }

        return response.message;
    };

    getFilterGroupsForVisual = async (sheetId: string, visualId: string): Promise<FilterGroup[]> => {
        const response = await this.send<FilterGroup[]>(
            new EmbeddingMessageEvent(MessageEventName.GET_FILTER_GROUPS_FOR_VISUAL, {
                SheetId: sheetId,
                VisualId: visualId,
            })
        );

        if (!Array.isArray(response?.message)) {
            throw new Error('Failed to retrieve filter groups for the visual');
        }

        return response.message;
    };

    getVisualActions = async (sheetId: string, visualId: string): Promise<VisualAction[]> => {
        const response = await this.send<VisualAction[]>(
            new EmbeddingMessageEvent(MessageEventName.GET_VISUAL_ACTIONS, {
                SheetId: sheetId,
                VisualId: visualId,
            })
        );

        if (!Array.isArray(response?.message)) {
            throw new Error('Failed to retrieve the visual actions');
        }

        return response.message;
    };

    addVisualActions = async (sheetId: string, visualId: string, actions: VisualAction[]): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.ADD_VISUAL_ACTIONS, {
                SheetId: sheetId,
                VisualId: visualId,
                Actions: actions,
            })
        );
    };

    setVisualActions = async (sheetId: string, visualId: string, actions: VisualAction[]): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.SET_VISUAL_ACTIONS, {
                SheetId: sheetId,
                VisualId: visualId,
                Actions: actions,
            })
        );
    };

    getSelectedSheetId = async (): Promise<string> => {
        const response = await this.send<string>(new EmbeddingMessageEvent(MessageEventName.GET_SELECTED_SHEET_ID));

        if (!response?.message) {
            throw new Error('Failed to retrieve the selected sheet id');
        }

        return response.message;
    };

    setSelectedSheetId = async (sheetId: string): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.SET_SELECTED_SHEET_ID, {
                SheetId: sheetId,
            })
        );
    };

    setTheme = async (themeArn: string): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.SET_THEME, {
                ThemeArn: themeArn,
            })
        );
    };

    navigateToDashboard = async (
        dashboardId: string,
        navigateToDashboardOptions?: NavigateToDashboardOptions
    ): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.NAVIGATE_TO_DASHBOARD, {
                DashboardId: dashboardId,
                Parameters: navigateToDashboardOptions?.parameters,
            })
        );
    };

    removeVisualActions = async (
        sheetId: string,
        visualId: string,
        actions: VisualAction[]
    ): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.REMOVE_VISUAL_ACTIONS, {
                SheetId: sheetId,
                VisualId: visualId,
                Actions: actions,
            })
        );
    };

    getSheetVisuals = async (sheetId: string): Promise<Visual[]> => {
        const response = await this.send<Visual[]>(
            new EmbeddingMessageEvent(MessageEventName.GET_SHEET_VISUALS, {
                SheetId: sheetId,
            })
        );

        if (!Array.isArray(response?.message)) {
            throw new Error('Failed to retrieve the sheet visuals');
        }

        return response.message;
    };

    setParameters = async (parameters: Parameter[]): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.SET_PARAMETERS, parameters));
    };

    reset = async (): Promise<ResponseMessage> => {
        return this.send(new EmbeddingMessageEvent(MessageEventName.RESET));
    };

    setThemeOverride = async (themeOverride: ThemeConfiguration): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.SET_THEME_OVERRIDE, {
                ThemeOverride: themeOverride,
            })
        );
    };

    setPreloadThemes = async (preloadThemes: string[]): Promise<ResponseMessage> => {
        return this.send(
            new EmbeddingMessageEvent(MessageEventName.PRELOAD_THEMES, {
                PreloadThemes: preloadThemes,
            })
        );
    };

    createSharedView = async (): Promise<ResponseMessage> => {
        const response = await this.send(new EmbeddingMessageEvent(MessageEventName.CREATE_SHARED_VIEW));
        if (!response?.message) {
            throw new Error('Failed to create shared view');
        }

        return response;
    };

    protected extractExperienceFromUrl = (url: string): IDashboardExperience => {
        const matches: Array<string> = /^https:\/\/[^/]+\/embed\/[^/]+\/dashboards\/([\w-]+)(\?|$)/i.exec(url) || [];
        if (matches.length < 3) {
            this.frameOptions.onChange?.(
                new ChangeEvent(
                    ChangeEventName.INVALID_URL,
                    ChangeEventLevel.ERROR,
                    'Invalid dashboard experience url',
                    {
                        url,
                    }
                ),
                {frame: null}
            );

            throw new Error('Invalid dashboard experience URL');
        }

        return {
            experienceType: ExperienceType.DASHBOARD,
            dashboardId: matches[1],
        };
    };

    private interceptMessage = (messageEvent: EmbeddingEvents, metadata?: ExperienceFrameMetadata) => {
        // Intercepting onMessage
        // if the resizeHeightOnSizeChangedEvent is true, upon receiving SIZE_CHANGED message, update the height of the iframe
        if (messageEvent.eventName === 'SIZE_CHANGED' && this.frameOptions.resizeHeightOnSizeChangedEvent) {
            metadata?.frame?.setAttribute?.('height', `${messageEvent?.message?.height}px`);
        }
        if (messageEvent.eventName === 'EXPERIENCE_INITIALIZED' && this.contentOptions?.themeOptions?.themeOverride) {
            this.setThemeOverride(this.contentOptions.themeOptions.themeOverride);
        }
        if (messageEvent.eventName === 'EXPERIENCE_INITIALIZED' && this.contentOptions?.themeOptions?.preloadThemes) {
            this.setPreloadThemes(this.contentOptions.themeOptions.preloadThemes);
        }
    };

    // We add content options into the query string of the iframe url.
    // Some option names do not match option names that the static content expects
    // This function converts the property names to the query string parameters that the static content expects
    private transformDashboardContentOptions = (contentOptions: DashboardContentOptions) => {
        const {
            parameters,
            locale,
            attributionOptions,
            sheetOptions,
            toolbarOptions,
            themeOptions,
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            onMessage,
            ...unrecognizedContentOptions
        } = contentOptions;

        const transformedContentOptions = this.transformContentOptions<TransformedDashboardContentOptions>(
            {
                locale,
            },
            unrecognizedContentOptions
        );

        if (Array.isArray(parameters)) {
            transformedContentOptions.parameters = parameters.reduce(
                (parametersAsObject: ParametersAsObject, parameter: Parameter) => {
                    return {
                        ...parametersAsObject,
                        [parameter.Name]: parameter.Values,
                    };
                },
                {}
            );
        }

        if (attributionOptions?.overlayContent !== true) {
            transformedContentOptions.footerPaddingEnabled = true;
        }

        if (toolbarOptions?.export || (toolbarOptions?.export as ExportToolbarOption)?.print) {
            transformedContentOptions.printEnabled = true;
        }

        if (toolbarOptions?.undoRedo !== true) {
            transformedContentOptions.undoRedoDisabled = true;
        }

        if (toolbarOptions?.reset !== true) {
            transformedContentOptions.resetDisabled = true;
        }

        if (toolbarOptions?.bookmarks === true) {
            transformedContentOptions.showBookmarksIcon = true;
        }

        if (toolbarOptions?.thresholdAlerts === true) {
            transformedContentOptions.showThresholdAlertsIcon = true;
        }

        if (toolbarOptions?.scheduling === true) {
            transformedContentOptions.showSchedulingIcon = true;
        }

        if (toolbarOptions?.executiveSummary === true) {
            transformedContentOptions.showExecutiveSummaryIcon = true;
        }

        if (toolbarOptions?.recentSnapshots === true) {
            transformedContentOptions.showRecentSnapshotsIcon = true;
        }

        if (sheetOptions?.initialSheetId) {
            transformedContentOptions.sheetId = sheetOptions.initialSheetId;
        }

        if (typeof sheetOptions?.singleSheet === 'boolean') {
            transformedContentOptions.sheetTabsDisabled = sheetOptions.singleSheet;
        }

        if (sheetOptions?.emitSizeChangedEventOnSheetChange) {
            transformedContentOptions.resizeOnSheetChange = true;
        }

        if (themeOptions?.themeArn) {
            transformedContentOptions.themeArn = themeOptions.themeArn;
        }

        return transformedContentOptions;
    };
}
