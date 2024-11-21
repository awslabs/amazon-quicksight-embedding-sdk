import {InternalExperiences} from '@experience/base-experience/types';
import {EmbeddingMessageEvent, ErrorResponse, SuccessResponse, TargetedMessageEvent} from '@common/events/events';

export const InvokerMessageEventName = {
    ACKNOWLEDGE: 'ACKNOWLEDGE',
    INITIATE_PRINT: 'INITIATE_PRINT',
    NAVIGATE_TO_DASHBOARD: 'NAVIGATE_TO_DASHBOARD',
    CLOSE_Q_SEARCH: 'CLOSE_Q_SEARCH',
    UNDO: 'UNDO',
    REDO: 'REDO',
    RESET: 'RESET',
    TOGGLE_EXECUTIVE_SUMMARY_PANE: 'TOGGLE_EXECUTIVE_SUMMARY_PANE',
    OPEN_BUILD_VISUAL_PANE: 'OPEN_BUILD_VISUAL_PANE',
    OPEN_DATA_QNA_PANE: 'OPEN_DATA_QNA_PANE',
    TOGGLE_BOOKMARKS_PANE: 'TOGGLE_BOOKMARKS_PANE',
    TOGGLE_THRESHOLD_ALERTS_PANE: 'TOGGLE_THRESHOLD_ALERTS_PANE',
    TOGGLE_SCHEDULING_PANE: 'TOGGLE_SCHEDULING_PANE',
    TOGGLE_RECENT_SNAPSHOTS_PANE: 'TOGGLE_RECENT_SNAPSHOTS_PANE',
} as const;

export type InvokerMessageEventName = (typeof InvokerMessageEventName)[keyof typeof InvokerMessageEventName];

export type InvokerMessageEvents =
    | TargetedMessageEvent<
          typeof InvokerMessageEventName.ACKNOWLEDGE,
          {eventName: string; eventTarget?: InternalExperiences}
      >
    | EmbeddingMessageEvent<typeof InvokerMessageEventName.INITIATE_PRINT, SuccessResponse | ErrorResponse>
    | EmbeddingMessageEvent<typeof InvokerMessageEventName.NAVIGATE_TO_DASHBOARD, SuccessResponse | ErrorResponse>
    | EmbeddingMessageEvent<typeof InvokerMessageEventName.CLOSE_Q_SEARCH, SuccessResponse | ErrorResponse>
    | EmbeddingMessageEvent<typeof InvokerMessageEventName.UNDO, SuccessResponse | ErrorResponse>
    | EmbeddingMessageEvent<typeof InvokerMessageEventName.REDO, SuccessResponse | ErrorResponse>
    | EmbeddingMessageEvent<typeof InvokerMessageEventName.RESET, SuccessResponse | ErrorResponse>
    | EmbeddingMessageEvent<
          typeof InvokerMessageEventName.TOGGLE_EXECUTIVE_SUMMARY_PANE,
          SuccessResponse | ErrorResponse
      >
    | EmbeddingMessageEvent<typeof InvokerMessageEventName.OPEN_BUILD_VISUAL_PANE, SuccessResponse | ErrorResponse>
    | EmbeddingMessageEvent<typeof InvokerMessageEventName.OPEN_DATA_QNA_PANE, SuccessResponse | ErrorResponse>
    | EmbeddingMessageEvent<typeof InvokerMessageEventName.TOGGLE_BOOKMARKS_PANE, SuccessResponse | ErrorResponse>;
