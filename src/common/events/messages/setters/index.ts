import {EmbeddingMessageEvent} from '@common/events/events';
import {Parameter} from '../../../types';
import {VisualAction} from '@experience/dashboard-experience/types';

export const SetterMessageEventName = {
    SET_PARAMETERS: 'SET_PARAMETERS',
    SET_SELECTED_SHEET_ID: 'SET_SELECTED_SHEET_ID',
    SET_Q_SEARCH_QUESTION: 'SET_Q_SEARCH_QUESTION',
    SET_VISUAL_ACTIONS: 'SET_VISUAL_ACTIONS',
    ADD_VISUAL_ACTIONS: 'ADD_VISUAL_ACTIONS',
    REMOVE_VISUAL_ACTIONS: 'REMOVE_VISUAL_ACTIONS',
} as const;

export type SetterMessageEventName = (typeof SetterMessageEventName)[keyof typeof SetterMessageEventName];

export type SetterMessageEvents =
    | EmbeddingMessageEvent<typeof SetterMessageEventName.SET_PARAMETERS, Parameter[]>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.REMOVE_VISUAL_ACTIONS, VisualAction[]>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.ADD_VISUAL_ACTIONS, VisualAction[]>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.SET_VISUAL_ACTIONS, VisualAction[]>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.SET_Q_SEARCH_QUESTION, {question?: string}>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.SET_SELECTED_SHEET_ID, {sheetId?: string}>;
