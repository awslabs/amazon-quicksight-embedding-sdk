// Copyright 2024 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {Parameter, ParametersAsObject, ThemeOptions} from '../../common';
import {BaseContentOptions, ExperienceType, IBaseExperience} from '../base-experience';
import type {
    ColumnIdentifier,
    AggregationFunction,
    DateDimensionField,
    VisualCustomActionOperation,
    VisualCustomAction,
    ThemeConfiguration,
} from '@aws-sdk/client-quicksight';

export interface IDashboardExperience extends IBaseExperience {
    experienceType: typeof ExperienceType.DASHBOARD;
    dashboardId: string;
}

export interface InternalDashboardExperience extends IDashboardExperience {
    contextId: string;
}

export interface DashboardContentOptions extends BaseContentOptions {
    parameters?: Parameter[];
    locale?: string;
    attributionOptions?: AttributionOptions;
    toolbarOptions?: ToolbarOptions;
    sheetOptions?: SheetOptions;
    themeOptions?: ThemeOptions;
    viewId?: string;
}

export interface TransformedDashboardContentOptions extends BaseContentOptions {
    parameters?: ParametersAsObject;
    locale?: string;
    sheetId?: string | undefined;
    footerPaddingEnabled?: boolean;
    undoRedoDisabled?: boolean;
    printEnabled?: boolean;
    showBookmarksIcon?: boolean;
    showThresholdAlertsIcon?: boolean;
    showSchedulingIcon?: boolean;
    showRecentSnapshotsIcon?: boolean;
    hideAutoRefresh?: boolean;
    resetDisabled?: boolean;
    sheetTabsDisabled?: boolean;
    resizeOnSheetChange?: boolean;
    themeArn?: string;
    themeOverride?: ThemeConfiguration;
}

export interface ToolbarOption {
    show?: true; // absence implies true
}

export interface ExportToolbarOption extends ToolbarOption {
    print?: boolean;
}

export interface ToolbarOptions {
    export?: boolean | ExportToolbarOption;
    undoRedo?: boolean | ToolbarOption;
    reset?: boolean | ToolbarOption;
    bookmarks?: boolean | ToolbarOption;
    thresholdAlerts?: boolean | ToolbarOption;
    scheduling?: boolean | ToolbarOption;
    recentSnapshots?: boolean | ToolbarOption;
}

export interface AttributionOptions {
    overlayContent?: boolean;
}

export interface SheetOptions {
    initialSheetId?: string;
    singleSheet?: boolean;
    emitSizeChangedEventOnSheetChange?: boolean;
}

export type NavigateToDashboardOptions = {
    parameters?: Parameter[];
};

export interface Sheet {
    Name: string;
    SheetId: string;
}

export interface Visual {
    Name: string;
    VisualId: string;
}

export type BinDatapointRawValue = {
    Min: number | null;
    Max: number | null;
    IsMaxInclusive: boolean;
};

export interface DatapointRawValue {
    String?: string;
    Integer?: number;
    Decimal?: number;
    Date?: Date;
    Bin?: BinDatapointRawValue;
}

export const SPECIAL_DATAPOINT_VALUE_TYPES = {
    NULL: null,
    OTHER_BUCKET: null,
} as const;

export const CALCULATED_METRIC_COLUMN_TYPE = {
    INTEGER: null,
    STRING: null,
    DECIMAL: null,
    DATETIME: null,
} as const;

export interface DatapointFormattedValue {
    Value: string;
    Special?: keyof typeof SPECIAL_DATAPOINT_VALUE_TYPES;
}

export interface MetricColumn {
    Integer?: {
        Column: ColumnIdentifier;
        AggregationFunction?: AggregationFunction['NumericalAggregationFunction'];
    };
    Decimal?: {
        Column: ColumnIdentifier;
        AggregationFunction?: AggregationFunction['NumericalAggregationFunction'];
    };
    String?: {
        Column: ColumnIdentifier;
        AggregationFunction?: AggregationFunction['CategoricalAggregationFunction'];
    };
    DateTime?: {
        Column: ColumnIdentifier;
        AggregationFunction?: AggregationFunction['DateAggregationFunction'];
    };
    Calculated?: {
        Column: ColumnIdentifier;
        Expression: string;
        Type: keyof typeof CALCULATED_METRIC_COLUMN_TYPE;
    };
    Bin?: {
        Column: ColumnIdentifier;
    };
}

export interface FieldColumn {
    Integer?: {
        Column: ColumnIdentifier;
    };
    Decimal?: {
        Column: ColumnIdentifier;
    };
    String?: {
        Column: ColumnIdentifier;
    };
    DateTime?: {
        Column: ColumnIdentifier;
        TimeGranularity: DateDimensionField['DateGranularity'];
    };
}

export interface DatapointColumn {
    Metric?: MetricColumn;
    Field?: FieldColumn;
}

export interface Datapoint {
    FormattedValues: DatapointFormattedValue[];
    RawValues: DatapointRawValue[];
    Columns: DatapointColumn[];
    SelectedColumnIndex?: number;
}

export interface CallbackOperation {
    EmbeddingMessage: object;
}

export type ActionOperation = {
    CallbackOperation: CallbackOperation;
} & VisualCustomActionOperation;

export interface VisualAction extends VisualCustomAction {
    ActionOperations: ActionOperation[];
}
