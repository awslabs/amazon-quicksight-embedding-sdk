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
    TOGGLE_BOOKMARKS_PANE: 'TOGGLE_BOOKMARKS_PANE',
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
    | EmbeddingMessageEvent<typeof InvokerMessageEventName.TOGGLE_BOOKMARKS_PANE, SuccessResponse | ErrorResponse>;
