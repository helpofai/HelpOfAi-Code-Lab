import { create } from 'zustand';

const useProjectStore = create((set) => ({
    html: '<h1>Hello HOACodeLab!</h1>',
    css: 'h1 { color: #4f46e5; font-family: sans-serif; }',
    js: 'console.log("Welcome to HOACodeLab!");',
    title: 'Untitled Project',
    externalLibraries: [],
    
    setHtml: (html) => set({ html }),
    setCss: (css) => set({ css }),
    setJs: (js) => set({ js }),
    setTitle: (title) => set({ title }),
    setExternalLibraries: (libs) => set({ externalLibraries: libs }),
    
    setProject: (project) => set({
        html: project.code?.html || '',
        css: project.code?.css || '',
        js: project.code?.js || '',
        title: project.title || 'Untitled Project',
        externalLibraries: project.settings?.externalLibraries || [],
    }),
}));

export default useProjectStore;
