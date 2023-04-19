// Copyright 2022 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {encode} from 'punycode';
import {BuildExperienceUrlOptions, TargetedMessageEvent, InternalExperience, PostMessageEvent, UrlInfo, ParameterValue} from '../types';

const SDK_VERSION = '2.1.0';

const FRAME_TIMEOUT = 60000;

const isMessageEvent = (messageEvent: TargetedMessageEvent): messageEvent is TargetedMessageEvent => {
    return !!messageEvent && !!messageEvent.eventTarget && !!messageEvent.eventName;
};

const isPostMessageEvent = (messageEvent: PostMessageEvent): messageEvent is PostMessageEvent => {
    return !!messageEvent && !!messageEvent.eventId && !!messageEvent.eventTarget && !!messageEvent.eventName;
};

const getUrlInfo = (url: string): UrlInfo => {
    const matches: Array<string> = /^(https:\/\/[^/]+)\/(embedding|embed)\/([^/]+)\/[^?]+\?(.*)/i.exec(url) || [];
    if (matches?.length < 4) {
        throw `Invalid embedding url: "${url}"`;
    }
    const urlInfo: UrlInfo = {
        guid: matches[3],
        host: matches[1],
        urlSearchParams: new URLSearchParams(matches[4]),
    };
    return urlInfo;
};

const buildQueryString = (options: Record<string, string | number>): string => {
    if (!options || typeof options !== 'object') {
        return '';
    }
    const filteredOptions = Object.entries(options).reduce(
        (newOptions, [key, value]) => {
            if (value !== undefined && value !== null) {
                newOptions[key] = `${value}`;
            }
            return newOptions;
        },
        {
            punyCodeEmbedOrigin: encode(`${window.location.origin}/`),
        } as Record<string, string>
    );
    return new URLSearchParams(filteredOptions).toString();
};

const buildParametersString = (parameters: ParameterValue[]): string => {
    if (!parameters || typeof parameters !== 'object') {
        return '';
    }
    const processedParameters = Object.entries(parameters).map(([key, value]) => {
        const values = [].concat(value);
        const encodedName = encodeURIComponent(key);
        return values
            .map(paramValue => encodeURIComponent(paramValue))
            .map(encodedValue => `p.${encodedName}=${encodedValue}`)
            .join('&');
    });
    return processedParameters.join('&');
};

const buildExperienceUrl = (baseUrl: URL | string, options: BuildExperienceUrlOptions = {}, internalExperience: InternalExperience) => {
    const {parameters, ...otherOptions} = options;
    const {contextId, discriminator} = internalExperience;
    const fullQueryStringArray: string[] = [];
    const queryString = buildQueryString({
        ...otherOptions,
        contextId,
        discriminator,
        clientTime: Date.now(),
        sdkVersion: SDK_VERSION,
    });
    if (queryString) {
        fullQueryStringArray.push(queryString);
    }
    const parametersString = buildParametersString(parameters as ParameterValue[]);
    if (parametersString) {
        fullQueryStringArray.push(parametersString);
    }
    const fullQueryString: string = fullQueryStringArray.join('#');
    const baseUrlString = typeof baseUrl === 'string' ? baseUrl : baseUrl.toString();
    return [baseUrlString, fullQueryString].join(baseUrlString.includes('?') ? '&' : '?');
};

const wait = async (delay = 0): Promise<void> => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve();
        }, delay);
    });
};

export {buildExperienceUrl, getUrlInfo, isPostMessageEvent, isMessageEvent, FRAME_TIMEOUT, wait, SDK_VERSION};
