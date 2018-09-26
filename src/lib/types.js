// @flow

export type EmbeddingOptions = {
    url: string,
    container: HTMLElement | string,
    errorCallback: ?Function,
    loadCallback: ?Function,
    parameters: ?Object,
    width: ?string,
    height: ?string
};