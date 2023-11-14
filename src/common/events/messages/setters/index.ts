import {EmbeddingMessageEvent} from '@common/events/events';
import {Parameter} from '../../../types';
import {VisualAction} from '@experience/dashboard-experience/types';
import type {FilterGroup, ThemeConfiguration} from '@aws-sdk/client-quicksight';

export const SetterMessageEventName = {
    SET_PARAMETERS: 'SET_PARAMETERS',
    SET_SELECTED_SHEET_ID: 'SET_SELECTED_SHEET_ID',
    SET_Q_SEARCH_QUESTION: 'SET_Q_SEARCH_QUESTION',
    SET_VISUAL_ACTIONS: 'SET_VISUAL_ACTIONS',
    SET_THEME: 'SET_THEME',
    ADD_FILTER_GROUPS: 'ADD_FILTER_GROUPS',
    UPDATE_FILTER_GROUPS: 'UPDATE_FILTER_GROUPS',
    REMOVE_FILTER_GROUPS: 'REMOVE_FILTER_GROUPS',
    ADD_VISUAL_ACTIONS: 'ADD_VISUAL_ACTIONS',
    REMOVE_VISUAL_ACTIONS: 'REMOVE_VISUAL_ACTIONS',
    SET_THEME_OVERRIDE: 'SET_THEME_OVERRIDE',
} as const;

export type SetterMessageEventName = (typeof SetterMessageEventName)[keyof typeof SetterMessageEventName];

export type SetterMessageEvents =
    | EmbeddingMessageEvent<typeof SetterMessageEventName.SET_PARAMETERS, Parameter[]>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.REMOVE_VISUAL_ACTIONS, VisualAction[]>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.ADD_FILTER_GROUPS, FilterGroup[]>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.UPDATE_FILTER_GROUPS, FilterGroup[]>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.REMOVE_FILTER_GROUPS, FilterGroup[] | string[]>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.ADD_VISUAL_ACTIONS, VisualAction[]>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.SET_THEME, {themeArn?: string}>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.SET_VISUAL_ACTIONS, VisualAction[]>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.SET_Q_SEARCH_QUESTION, {question?: string}>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.SET_SELECTED_SHEET_ID, {sheetId?: string}>
    | EmbeddingMessageEvent<typeof SetterMessageEventName.SET_THEME_OVERRIDE, ThemeConfiguration>;
