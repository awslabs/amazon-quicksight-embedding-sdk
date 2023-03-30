import {CreateIframeOptions, CreatePostRequestOptions, EmbeddingIFrameElement, PostRequest} from '../types';

const createSvgElement = (tagName: string, attributes: Record<string, string>, children: Element[] = []) => {
    const element = document.createElementNS('http://www.w3.org/2000/svg', tagName);
    Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, value));
    children.forEach(child => element.appendChild(child));
    return element;
};

const circles: Element[] = [1, 2, 3].map(i => {
    const animate = createSvgElement('animate', {
        attributeName: 'opacity',
        dur: '1s',
        values: '0;1;0',
        repeatCount: 'indefinite',
        begin: `${i / 10.0}`,
    });
    const circle = createSvgElement(
        'circle',
        {
            fill: '#ccc',
            stroke: 'none',
            cx: `${i * 20 - 14}`,
            cy: '50',
            r: '6',
        },
        [animate]
    );
    return circle;
});

const loaderSVG = createSvgElement(
    'svg',
    {
        version: '1.1',
        x: '0px',
        y: '0px',
        viewBox: '0 0 100 100',
        'enable-background': 'new 0 0 0 0',
        style: 'width:100px; height:100px;',
    },
    circles
);

const createPostRequest = (postRequestOptions: CreatePostRequestOptions): PostRequest => {
    const {src, container, target, payload} = postRequestOptions;
    if (!src || !container) {
        return;
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

    form.submit();
    return {
        remove: () => {
            form.remove();
        },
    };
};

const createIframe = (options: CreateIframeOptions): EmbeddingIFrameElement | null => {
    const {id, src, width = '0px', height = '0px', container, onLoad, loading, withIframePlaceholder, payload, className} = options;

    let iframePlaceholder: HTMLDivElement;

    const iframeName = id || `${container.id}-iframe`;

    if (withIframePlaceholder) {
        iframePlaceholder = document.createElement('div');
        iframePlaceholder.id = `${iframeName}-placeholder`;
        iframePlaceholder.style.width = width;
        iframePlaceholder.style.backgroundColor = 'rgba(0,0,0,.01)';
        iframePlaceholder.style.display = 'flex';
        iframePlaceholder.style.justifyContent = 'center';
        iframePlaceholder.style.alignItems = 'center';

        if (height.endsWith('px')) {
            iframePlaceholder.style.height = height;
        }
        if (typeof withIframePlaceholder !== 'boolean') {
            iframePlaceholder.appendChild(withIframePlaceholder);
        } else {
            iframePlaceholder.appendChild(loaderSVG);
        }
        container.appendChild(iframePlaceholder);
    }

    const _className = ['quicksight-embedding-iframe'];
    if (className) {
        _className.push(className);
    }

    const iframe: EmbeddingIFrameElement = document.createElement('iframe');
    iframe.className = _className.join(' ').trim();
    iframe.id = iframeName;
    iframe.name = iframeName;
    iframe.width = width;
    iframe.height = height;

    if (loading) {
        iframe.loading = loading;
    }
    iframe.style.border = '0px';
    iframe.style.padding = '0px';

    if (iframePlaceholder) {
        iframe.style.opacity = '0';
    }

    if (width === '0px' && height === '0px') {
        iframe.style.position = 'absolute';
    }

    try {
        container.appendChild(iframe);
    } catch (error) {
        return null;
    }

    let postRequest: PostRequest;

    if (payload) {
        postRequest = createPostRequest({
            src,
            target: iframe.name,
            container,
            payload,
        });
    } else {
        iframe.src = src;
    }

    const onLoadLocal = (event: Event) => {
        if (iframePlaceholder) {
            iframePlaceholder.remove();
            iframe.style.opacity = '1';
            iframe.style.transition = 'opacity .5s ease-in-out';
        }
        typeof onLoad === 'function' && onLoad(event);
        postRequest?.remove();
    };
    iframe.addEventListener('load', onLoadLocal);

    return iframe;
};

export default createIframe;
