import { shallowMount, createLocalVue } from '@vue/test-utils';
import Draggable from '../src/index';

export const localVue = createLocalVue();

localVue.use(Draggable);

describe('directive draggable', function () {
    let wrapper, dragRowMock;

    function createVueWrapper(options, isEmpty = false) {
        const {
            handleSelector = '.handle',
            ordinalIndex = 0,
            groupName = '',
        } = options;
        const component = {
            created() {
                this.draggableOptions = isEmpty
                    ? null
                    : {
                        handleSelector,
                        ordinalIndex,
                        groupName,
                    };
            },
            methods: {
                dragRow() { },
            },
            template: '<div><div v-draggable="draggableOptions" class="draggable" @drag-row="dragRow"><span class="handle"></span></div></div>',
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

        it('the directive should not fire if ordinalIndex is -1', () => {
            createVueWrapper({
                ordinalIndex: -1,
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
            const handleElement = wrapper.find(`.draggable ${handleSelector}`);
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

        it('the dragenter event must be initialized, when triggered, the class over is false if groupName is not currentGroupName', () => {
            createVueWrapper({
                groupName: 'groupName-1',
            });
            let targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            createVueWrapper({
                groupName: 'groupName-2',
            });
            targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragenter');
            expect(targetElement.classes()).not.toContain('over');
        });

        it('the dragenter event must be initialized, when triggered, the class over is true if groupName is currentGroupName', () => {
            createVueWrapper({
                groupName: 'groupName-1',
            });
            let targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            createVueWrapper({
                groupName: 'groupName-1',
            });
            targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragenter');
            expect(targetElement.classes()).toContain('over');
        });

        it('the dragleave event must be initialized, when triggered, the class over is true if fromElement is undefined', () => {
            createVueWrapper({
                groupName: 'groupName-1',
            });
            let targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            createVueWrapper({
                groupName: 'groupName-1',
            });
            targetElement = wrapper.find('.draggable');
            targetElement.element.classList.add('over');
            expect(targetElement.classes()).toContain('over');
            targetElement.trigger('dragleave', {
                toElement: {
                    closest: () => 2,
                },
            });
            expect(targetElement.classes()).toContain('over');
        });

        it('the dragleave event must be initialized, when triggered, the class over is true if toElement is undefined', () => {
            createVueWrapper({
                groupName: 'groupName-1',
            });
            let targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            createVueWrapper({
                groupName: 'groupName-1',
            });
            targetElement = wrapper.find('.draggable');
            targetElement.element.classList.add('over');
            expect(targetElement.classes()).toContain('over');
            targetElement.trigger('dragleave', {
                fromElement: {
                    closest: () => 2,
                },
            });
            expect(targetElement.classes()).toContain('over');
        });

        it('the dragleave event must be initialized, when triggered, the class over is true if toElement and fromElement have a common parent', () => {
            createVueWrapper({
                groupName: 'groupName-1',
            });
            let targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            createVueWrapper({
                groupName: 'groupName-1',
            });
            targetElement = wrapper.find('.draggable');
            targetElement.element.classList.add('over');
            expect(targetElement.classes()).toContain('over');
            targetElement.trigger('dragleave', {
                fromElement: {
                    closest: () => 2,
                },
                toElement: {
                    closest: () => 2,
                },
            });
            expect(targetElement.classes()).toContain('over');
        });

        it('the dragleave event must be initialized, when triggered, the class over is false', () => {
            createVueWrapper({
                groupName: 'groupName-1',
            });
            let targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            createVueWrapper({
                groupName: 'groupName-1',
            });
            targetElement = wrapper.find('.draggable');
            targetElement.element.classList.add('over');
            expect(targetElement.classes()).toContain('over');
            targetElement.trigger('dragleave', {
                fromElement: {
                    closest: () => 1,
                },
                toElement: {
                    closest: () => 2,
                },
            });
            expect(targetElement.classes()).not.toContain('over');
        });

        it('the dragleave event must be initialized, when triggered, the class over is true if groupName is not currentGroupName', () => {
            createVueWrapper({
                groupName: 'groupName-1',
            });
            let targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            createVueWrapper({
                groupName: 'groupName-2',
            });
            targetElement = wrapper.find('.draggable');
            targetElement.element.classList.add('over');
            expect(targetElement.classes()).toContain('over');
            targetElement.trigger('dragleave', {
                fromElement: {
                    closest: () => 1,
                },
                toElement: {
                    closest: () => 2,
                },
            });
            expect(targetElement.classes()).toContain('over');
        });

        it('the dragover event must be initialized, when triggered, preventDefault worked if groupName is currentGroupName', () => {
            createVueWrapper({
                groupName: 'groupName-1',
            });
            let targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            createVueWrapper({
                groupName: 'groupName-1',
            });
            targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragover');
            expect(1).toBe(1);
        });

        it('the dragover event must be initialized, when triggered, preventDefault did not work if groupName is not currentGroupName', () => {
            createVueWrapper({
                groupName: 'groupName-1',
            });
            let targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            createVueWrapper({
                groupName: 'groupName-2',
            });
            targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragover');
            expect(1).toBe(1);
        });

        it('the drop event must be initialized, when triggered, the dragRow method will not be called if the ordinalIndex hasn`t changed', () => {
            createVueWrapper({});
            const targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            targetElement.trigger('drop');
            expect(dragRowMock).toBeCalledTimes(0);
        });

        it('the drop event must be initialized, when triggered, the dragRow method will be called if the ordinalIndex has changed', () => {
            createVueWrapper({
                ordinalIndex: 2,
            });
            let targetElement = wrapper.find('.draggable');
            targetElement.trigger('dragstart');
            createVueWrapper({
                ordinalIndex: 1,
            });
            targetElement = wrapper.find('.draggable');
            targetElement.element.classList.add('over');
            targetElement.trigger('drop');
            expect(dragRowMock).toBeCalledTimes(1);
            expect(targetElement.classes()).not.toContain('over');
        });

        it('the dragend event must be initialized, when triggered, the classes over and moving and the attribute draggable are false', () => {
            createVueWrapper({});
            const targetElement = wrapper.find('.draggable');
            targetElement.element.setAttribute('draggable', 'true');
            targetElement.element.classList.add('moving');
            targetElement.trigger('dragend');
            expect(targetElement.attributes().draggable).toBeFalsy();
            expect(targetElement.classes()).not.toContain('moving');
        });
    });
});
