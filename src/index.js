import directive from './directive';

const plugin = {
    install (Vue, options = {}) {
        Vue.directive(options.name || 'draggable' , directive);
    },
};

export const draggable = directive;
export default plugin;
