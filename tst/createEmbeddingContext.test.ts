import createEmbeddingContext from '../src/createEmbeddingContext';
import eventManagerBuilder from '../src/eventManager';

jest.mock('../src/eventManager');

describe('createEmbeddingContext', () => {
    it('should create the embedding context', async () => {
        const embeddingContext = await createEmbeddingContext({
            onChange: null,
        });
        expect(typeof embeddingContext.embedDashboard).toEqual('function');
        expect(typeof embeddingContext.embedVisual).toEqual('function');
        expect(typeof embeddingContext.embedConsole).toEqual('function');
        expect(typeof embeddingContext.embedQSearchBar).toEqual('function');
        expect(eventManagerBuilder).toHaveBeenCalled();
    });

    it('should throw error if frameOptions is not provided for embedDashboard method', async () => {
        const embeddingContext = await createEmbeddingContext({
            onChange: null,
        });
        const embedExperienceWrapper = async () => {
            return await embeddingContext.embedDashboard(undefined);
        };
        await expect(embedExperienceWrapper).rejects.toThrow('embedDashboard is called without frameOptions');
    });

    it('should throw error if invalid frameOptions is provided for embedDashboard method', async () => {
        const embeddingContext = await createEmbeddingContext({
            onChange: null,
        });
        const embedExperienceWrapper = async () => {
            // @ts-expect-error - should throw error when frameOption is invalid
            return await embeddingContext.embedDashboard(5);
        };
        await expect(embedExperienceWrapper).rejects.toThrow('embedDashboard is called with non-object frameOptions');
    });

    it('should throw error if frameOptions is not provided for embedVisual method', async () => {
        const embeddingContext = await createEmbeddingContext({
            onChange: null,
        });
        const embedExperienceWrapper = async () => {
            return await embeddingContext.embedVisual(undefined);
        };
        await expect(embedExperienceWrapper).rejects.toThrow('embedVisual is called without frameOptions');
    });

    it('should throw error if invalid frameOptions is provided for embedVisual method', async () => {
        const embeddingContext = await createEmbeddingContext({
            onChange: null,
        });
        const embedExperienceWrapper = async () => {
            // @ts-expect-error - should throw error when frameOption is invalid
            return await embeddingContext.embedVisual([]);
        };
        await expect(embedExperienceWrapper).rejects.toThrow('embedVisual is called with non-object frameOptions');
    });

    it('should throw error if frameOptions is not provided for embedConsole method', async () => {
        const embeddingContext = await createEmbeddingContext({
            onChange: null,
        });
        const embedExperienceWrapper = async () => {
            return await embeddingContext.embedConsole(undefined);
        };
        await expect(embedExperienceWrapper).rejects.toThrow('embedConsole is called without frameOptions');
    });

    it('should throw error if invalid frameOptions is provided for embedConsole method', async () => {
        const embeddingContext = await createEmbeddingContext({
            onChange: null,
        });
        const embedExperienceWrapper = async () => {
            // @ts-expect-error - should throw error when frameOption is invalid
            return await embeddingContext.embedConsole('5');
        };
        await expect(embedExperienceWrapper).rejects.toThrow('embedConsole is called with non-object frameOptions');
    });

    it('should throw error if frameOptions is not provided for embedQSearchBar method', async () => {
        const embeddingContext = await createEmbeddingContext({
            onChange: null,
        });
        const embedExperienceWrapper = async () => {
            return await embeddingContext.embedQSearchBar(undefined);
        };
        await expect(embedExperienceWrapper).rejects.toThrow('embedQSearchBar is called without frameOptions');
    });

    it('should throw error if invalid frameOptions is provided for embedQSearchBar method', async () => {
        const embeddingContext = await createEmbeddingContext({
            onChange: null,
        });
        const embedExperienceWrapper = async () => {
            // @ts-expect-error - should throw error when frameOption is invalid
            return await embeddingContext.embedQSearchBar(true);
        };
        await expect(embedExperienceWrapper).rejects.toThrow('embedQSearchBar is called with non-object frameOptions');
    });
});
