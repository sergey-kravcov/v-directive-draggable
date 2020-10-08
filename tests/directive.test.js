import { shallowMount, createLocalVue } from '@vue/test-utils';
import Draggable from '../src/index';
import $ from 'jquery';

export const localVue = createLocalVue();

localVue.use(Draggable);

describe('directive draggable', function () {
    let wrapper, dragRowMock;

    function createVueWrapper(options, isEmpty = false) {
        const {
            handleSelector = '.handle',
            index = 0,
        } = options;
        const component = {
            created() {
                this.draggableOptions = isEmpty
                    ? null
                    : {
                        handleSelector,
                        index,
                    };
            },
            methods: {
                dragRow() { },
            },
            template: '<div><div v-draggable="draggableOptions" class="draggable" @dragRow="dragRow"><span class="handle"></span></div></div>',
        };

        wrapper = shallowMount(component, {
			localVue,
            methods: {
                dragRow: dragRowMock,
            },
        });
    }

    beforeAll(() => {
        dragRowMock = jest.fn().mockReturnValue(undefined);
    });

    afterAll(() => {
        dragRowMock.mockRestore();
    });

    describe('bind', () => {
        it('the directive should not fire if the passed data is empty', () => {
            createVueWrapper({}, true);
            const targetSection = wrapper.find('.draggable');
            expect(targetSection.classes()).not.toContain('draggable-element');
        });

        it('the directive should not fire if index is -1', () => {
            createVueWrapper({
                index: -1,
            });
            const targetSection = wrapper.find('.draggable');
            expect(targetSection.classes()).not.toContain('draggable-element');
        });

        it('the directive should not fire if handleSelector is incorrect', () => {
            createVueWrapper({
                handleSelector: '.handle1',
            });
            const targetSection = wrapper.find('.draggable');
            expect(targetSection.classes()).not.toContain('draggable-element');
        });

        it('bind directive should work correctly if handleSelector is empty', () => {
            createVueWrapper({
                handleSelector: '',
            });
            const targetElement = wrapper.find('.draggable');
            expect(targetElement.classes()).toContain('draggable-element');
            targetElement.trigger('mousedown');
            expect(targetElement.attributes().draggable).toBeTruthy();
        });

        it('bind directive should work correctly if all parameters are passed', () => {
            createVueWrapper({});
            const targetElement = wrapper.find('.draggable');
            expect(targetElement.classes()).toContain('draggable-element');
        });

        it('the mousedown event must be initialized, when triggered, the attribute draggable is true', () => {
            const handleSelector = '.handle';
            createVueWrapper({
                handleSelector,
            });
            const targetElement = wrapper.find('.draggable');
            const handleElement= wrapper.find(`.draggable ${handleSelector}`);
            expect(targetElement.attributes().draggable).toBeFalsy();
            handleElement.trigger('mousedown');
            expect(targetElement.attributes().draggable).toBeTruthy();
        });

        it('the dragstart event must be initialized, when triggered, the class moving is true', () => {
            createVueWrapper({});
            const targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            expect(targetElement.classes()).toContain('moving');
        });

        it('the dragenter event must be initialized, when triggered, the class over is true', () => {
            createVueWrapper({});
            const targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragenter');
            expect(targetElement.classes()).toContain('over');
        });

        it('the dragleave event must be initialized, when triggered, the class over is false', () => {
            createVueWrapper({});
            const targetElement = wrapper.find('.draggable');
            $(targetElement.element).addClass('over');
            expect(targetElement.classes()).toContain('over');
            targetElement.trigger('dragleave');
            expect(targetElement.classes()).not.toContain('over');
        });

        it('the drop event must be initialized, when triggered, the dragRow method will not be called if the index hasn`t changed', () => {
            createVueWrapper({});
            const targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            targetElement.trigger('drop');
            expect(dragRowMock).toHaveBeenCalledTimes(0);
        });

        it('the drop event must be initialized, when triggered, the dragRow method will be called if the index has changed', () => {
            createVueWrapper({
                index: 2,
            });
            let targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            createVueWrapper({});
            targetElement = wrapper.find('.draggable');
            targetElement.trigger('drop');
            expect(dragRowMock).toHaveBeenCalledTimes(1);
        });

        it('the dragend event must be initialized, when triggered, the classes over and moving and the attribute draggable are false', () => {
            createVueWrapper({});
            const targetElement = wrapper.find('.draggable');
            $(targetElement.element).addClass('over');
            $(targetElement.element).addClass('moving');
            targetElement.element.setAttribute('draggable', 'true');
            targetElement.trigger('dragend');
            expect(targetElement.classes()).not.toContain('over');
            expect(targetElement.classes()).not.toContain('moving');
            expect(targetElement.attributes().draggable).toBeFalsy();
        });
    });
});
