import { create } from 'zustand';

const useProjectStore = create((set) => ({
    html: '<h1>Hello HOACodeLab!</h1>',
    css: 'h1 { color: #4f46e5; font-family: sans-serif; }',
    js: 'console.log("Welcome to HOACodeLab!");',
    title: 'Untitled Project',
    isPrivate: false,
    layout: 'bottom', // 'bottom', 'right', 'top'
    externalLibraries: [],
    fontSize: 14,
    wordWrap: 'on',
    
    setHtml: (html) => set({ html }),
    setCss: (css) => set({ css }),
    setJs: (js) => set({ js }),
    setTitle: (title) => set({ title }),
    setIsPrivate: (isPrivate) => set({ isPrivate }),
    setLayout: (layout) => set({ layout }),
    setExternalLibraries: (libs) => set({ externalLibraries: libs }),
    setFontSize: (size) => set({ fontSize: size }),
    setWordWrap: (wrap) => set({ wordWrap: wrap }),
    
    setProject: (project) => set({
        html: project.code?.html || '',
        css: project.code?.css || '',
        js: project.code?.js || '',
        title: project.title || 'Untitled Project',
        isPrivate: project.is_private || false,
        externalLibraries: project.settings?.externalLibraries || [],
    }),
}));

export default useProjectStore;
