// Copyright 2023 Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: Apache-2.0

import {CreatePostRequestOptions, PostRequest} from '../types';
import {EmbeddingIFrameElement, IframeOptions} from './types';

export class Iframe {
    static IFRAME_CLASS_NAME = 'quicksight-embedding-iframe';
    private readonly iframeName: string;
    private readonly width: string;
    private readonly height: string;
    private readonly loading: IframeOptions['loading'];
    private readonly container: HTMLElement;
    private readonly payload: IframeOptions['payload'];
    private readonly src: string;
    private readonly onLoad: IframeOptions['onLoad'];
    private readonly iframe: EmbeddingIFrameElement;
    private iframePlaceholder?: HTMLElement;
    private classNames = [Iframe.IFRAME_CLASS_NAME];
    private postRequest?: PostRequest;

    constructor(options: IframeOptions) {
        const {
            id,
            src,
            width = '0px',
            height = '0px',
            container,
            onLoad,
            loading,
            withIframePlaceholder,
            payload,
            className,
        } = options;

        this.width = width;
        this.height = height;
        this.onLoad = onLoad;
        this.iframeName = id;

        this.loading = loading;

        if (className) {
            this.classNames.push(className);
        }

        this.container = container;
        this.payload = payload;
        this.src = src;

        if (withIframePlaceholder) {
            this.createIframePlaceholder(withIframePlaceholder);
        }

        this.iframe = this.createIframe();
        this.iframe.addEventListener('load', this.onLoadLocal);
    }

    public getIframe = () => this.iframe;

    private createIframePlaceholder = (withIframePlaceholder: IframeOptions['withIframePlaceholder']) => {
        this.iframePlaceholder = document.createElement('div');
        this.iframePlaceholder.id = `${this.iframeName}-placeholder`;
        this.iframePlaceholder.style.width = this.width;
        this.iframePlaceholder.style.backgroundColor = 'rgba(0,0,0,.01)';
        this.iframePlaceholder.style.display = 'flex';
        this.iframePlaceholder.style.justifyContent = 'center';
        this.iframePlaceholder.style.alignItems = 'center';
        this.iframePlaceholder.className = `${Iframe.IFRAME_CLASS_NAME}-placeholder`;

        if (this.height.endsWith('px')) {
            this.iframePlaceholder.style.height = this.height;
        }

        if (withIframePlaceholder && typeof withIframePlaceholder !== 'boolean') {
            this.iframePlaceholder.appendChild(withIframePlaceholder);
        } else {
            const loaderSVG = this.createLoaderSVG();
            this.iframePlaceholder.appendChild(loaderSVG);
        }

        this.container.appendChild(this.iframePlaceholder);
    };

    private createIframe = () => {
        const iframe = document.createElement('iframe') as EmbeddingIFrameElement;
        iframe.className = this.classNames.join(' ').trim();
        iframe.id = this.iframeName;
        iframe.name = this.iframeName;
        iframe.width = this.width;
        iframe.height = this.height;

        if (this.loading) {
            iframe.loading = this.loading;
        }

        iframe.style.border = '0px';
        iframe.style.padding = '0px';

        if (this.iframePlaceholder) {
            iframe.style.opacity = '0';
            iframe.style.position = 'absolute';
        }

        if (this.width === '0px' && this.height === '0px') {
            iframe.style.position = 'absolute';
        }

        this.container.appendChild(iframe);

        if (this.payload) {
            this.postRequest = this.createPostRequest({
                src: this.src,
                target: iframe.name,
                container: this.container,
                payload: this.payload,
            });
        } else {
            iframe.src = this.src;
        }

        return iframe;
    };

    private onLoadLocal = (event: Event) => {
        if (this.iframePlaceholder) {
            this.iframePlaceholder.remove();
            this.iframe.style.position = '';
            this.iframe.style.opacity = '1';
            this.iframe.style.transition = 'opacity .5s ease-in-out';
        }

        this.onLoad?.(event);
        this.postRequest?.remove();
    };

    private createPostRequest = (postRequestOptions: CreatePostRequestOptions): PostRequest => {
        const {src, container, target, payload} = postRequestOptions;
        if (!src) {
            throw new Error('No source has been provided.');
        }

        const form = document.createElement('form');
        form.style.visibility = 'hidden';
        form.method = 'POST';
        form.action = src;
        form.target = target;
        form.name = `${target}-form`;

        Object.keys(payload).forEach(payloadItem => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = payloadItem;
            input.value = payload[payloadItem];
            form.appendChild(input);
        });

        container.appendChild(form);

        form?.submit();
        return {
            remove: () => {
                form.remove();
            },
        };
    };

    private createSvgElement = (
        tagName: string,
        attributes: Record<string, string>,
        styles: Record<string, string> = {},
        children: Element[] = []
    ) => {
        const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
        Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
        Object.entries(styles).forEach(([name, value]) => element.style.setProperty(name, value));
        children.forEach(child => element.appendChild(child));
        return element;
    };

    private createLoaderSVG = () => {
        const circles: Element[] = [1, 2, 3].map(i => {
            const animate = this.createSvgElement('animate', {
                attributeName: 'opacity',
                dur: '1s',
                values: '0;1;0',
                repeatCount: 'indefinite',
                begin: `${i / 10.0}`,
            });
            return this.createSvgElement(
                'circle',
                {
                    fill: '#ccc',
                    stroke: 'none',
                    cx: `${i * 20 - 14}`,
                    cy: '50',
                    r: '6',
                },
                undefined,
                [animate]
            );
        });

        return this.createSvgElement(
            'svg',
            {
                version: '1.1',
                x: '0px',
                y: '0px',
                viewBox: '0 0 100 100',
                'enable-background': 'new 0 0 0 0',
            },
            {
                width: '100px',
                height: '100px',
            },
            circles
        );
    };
}
