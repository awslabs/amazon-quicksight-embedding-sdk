import {EmbeddingEvent, TargetedMessageEvent} from '@common/events/events';
import {Parameter} from '../../../types';
import {Datapoint} from '@experience/dashboard-experience/types';

export const InfoMessageEventName = {
    CALLBACK_OPERATION_INVOKED: 'CALLBACK_OPERATION_INVOKED',
    CONTENT_LOADED: 'CONTENT_LOADED',
    EXPERIENCE_INITIALIZED: 'EXPERIENCE_INITIALIZED',
    ERROR_OCCURRED: 'ERROR_OCCURRED',
    SIZE_CHANGED: 'SIZE_CHANGED',
    PARAMETERS_CHANGED: 'PARAMETERS_CHANGED',
    SELECTED_SHEET_CHANGED: 'SELECTED_SHEET_CHANGED',
    MODAL_OPENED: 'MODAL_OPENED',
    Q_SEARCH_CLOSED: 'Q_SEARCH_CLOSED',
    Q_SEARCH_OPENED: 'Q_SEARCH_OPENED',
    Q_SEARCH_SIZE_CHANGED: 'Q_SEARCH_SIZE_CHANGED',
    Q_SEARCH_ENTERED_FULLSCREEN: 'Q_SEARCH_ENTERED_FULLSCREEN',
    Q_SEARCH_EXITED_FULLSCREEN: 'Q_SEARCH_EXITED_FULLSCREEN',
} as const;

export type InfoMessageEventName = (typeof InfoMessageEventName)[keyof typeof InfoMessageEventName];

export type InfoMessageEvents =
    | EmbeddingEvent<typeof InfoMessageEventName.CONTENT_LOADED, {title?: string}>
    | EmbeddingEvent<
          typeof InfoMessageEventName.CALLBACK_OPERATION_INVOKED,
          {
              CustomActionId: string;
              DashboardId: string;
              VisualId: string;
              SheetId: string;
              Datapoints: Datapoint[];
          }
      >
    | EmbeddingEvent<typeof InfoMessageEventName.SIZE_CHANGED, {height?: string; width?: string}>
    | TargetedMessageEvent<typeof InfoMessageEventName.EXPERIENCE_INITIALIZED, object>
    | EmbeddingEvent<typeof InfoMessageEventName.ERROR_OCCURRED, {errorCode?: string}>
    | EmbeddingEvent<typeof InfoMessageEventName.MODAL_OPENED, undefined>
    | EmbeddingEvent<
          typeof InfoMessageEventName.PARAMETERS_CHANGED,
          {
              changedParameters: Parameter[];
          }
      >
    | EmbeddingEvent<
          typeof InfoMessageEventName.SELECTED_SHEET_CHANGED,
          {selectedSheet: {Name?: string; SheetId: string}}
      >
    | EmbeddingEvent<typeof InfoMessageEventName.Q_SEARCH_CLOSED, {height?: string}>
    | EmbeddingEvent<typeof InfoMessageEventName.Q_SEARCH_ENTERED_FULLSCREEN, undefined>
    | EmbeddingEvent<typeof InfoMessageEventName.Q_SEARCH_OPENED, {height?: string}>
    | EmbeddingEvent<typeof InfoMessageEventName.Q_SEARCH_EXITED_FULLSCREEN, undefined>
    | EmbeddingEvent<typeof InfoMessageEventName.Q_SEARCH_SIZE_CHANGED, {height?: number}>;
