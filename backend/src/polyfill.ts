// Polyfill for Bun compatibility with newer Mongoose/BSON versions
console.log('Polyfill running');
const origGetBuiltinModule = globalThis.process?.getBuiltinModule;
if (origGetBuiltinModule) {
    globalThis.process.getBuiltinModule = (name: string) => {
        const mod = origGetBuiltinModule.call(globalThis.process, name);
        if (name === 'v8' && mod) {
            return {
                ...mod,
                startupSnapshot: {
                    ...(mod as any).startupSnapshot,
                    isBuildingSnapshot: () => false
                }
            };
        }
        return mod;
    };
}
