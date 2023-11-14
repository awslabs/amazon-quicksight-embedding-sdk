import * as EventMessages from '@common/events/messages';
import * as EventTypes from '@common/events/types';
import * as EventManagerTypes from '@common/event-manager/types';
import * as EmbeddingContextTypes from '@common/embedding-context/types';
import * as IframeTypes from '@common/iframe/types';
import * as CommonTypes from './common/types';

import * as BaseExperienceTypes from '@experience/base-experience/types';
import * as ConsoleExperienceTypes from '@experience/console-experience/types';
import * as DashboardExperienceTypes from '@experience/dashboard-experience/types';
import * as ControlExperienceTypes from '@experience/control-experience/types';
import * as QSearchExperienceTypes from '@experience/q-search-experience/types';
import * as VisualExperienceTypes from '@experience/visual-experience/types';

export * from './common';
export * from './experiences';

/**
 * Namespaces enums under one import for convenience
 *
 * @deprecated - Enums can be imported directly
 */
export const QSE = {
    ...CommonTypes,
    ...EventMessages,
    ...EventTypes,
    ...EventManagerTypes,
    ...EmbeddingContextTypes,
    ...IframeTypes,
    ...BaseExperienceTypes,
    ...ConsoleExperienceTypes,
    ...DashboardExperienceTypes,
    ...QSearchExperienceTypes,
    ...ControlExperienceTypes,
    ...VisualExperienceTypes,
};
