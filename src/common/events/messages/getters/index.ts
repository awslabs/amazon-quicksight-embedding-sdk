import {EmbeddingEvent} from '@common/events/events';
import {Parameter} from '../../../types';
import {Sheet, Visual, VisualAction} from '@experience/dashboard-experience/types';

export const GetterMessageEventName = {
    GET_PARAMETERS: 'GET_PARAMETERS',
    GET_SHEETS: 'GET_SHEETS',
    GET_SHEET_VISUALS: 'GET_SHEET_VISUALS',
    GET_VISUAL_ACTIONS: 'GET_VISUAL_ACTIONS',
    GET_SELECTED_SHEET_ID: 'GET_SELECTED_SHEET_ID',
} as const;

export type GetterMessageEventName = (typeof GetterMessageEventName)[keyof typeof GetterMessageEventName];

export type GetterMessageEvents =
    | EmbeddingEvent<typeof GetterMessageEventName.GET_PARAMETERS, Parameter[]>
    | EmbeddingEvent<typeof GetterMessageEventName.GET_SHEETS, Sheet[]>
    | EmbeddingEvent<typeof GetterMessageEventName.GET_SHEET_VISUALS, Visual[]>
    | EmbeddingEvent<typeof GetterMessageEventName.GET_VISUAL_ACTIONS, VisualAction[]>
    | EmbeddingEvent<typeof GetterMessageEventName.GET_SELECTED_SHEET_ID, string>;
