let draggableElementIndex;
let currentGroupName;

export default {
    bind: (element, binding) => {
        const { handleSelector = '', groupName = '', ordinalIndex = -1 } = binding.value || {};

        if (ordinalIndex === -1) {
            return;
        }
        let handleElement = element;
        if (handleSelector) {
            const handles = element.querySelectorAll(handleSelector);
            if (!handles.length) {
                return;
            }
            handleElement = handles[0];
        }

        element.classList.add('draggable-element');

        handleElement.addEventListener('mousedown', function () {
            element.setAttribute('draggable', 'true');
        });

        element.addEventListener('dragstart', function () {
            this.classList.add('moving');
            draggableElementIndex = ordinalIndex;
            currentGroupName = groupName;
        });
        element.addEventListener('dragenter', function () {
            if (currentGroupName === groupName) {
                this.classList.add('over');
            }
        });
        element.addEventListener('dragleave', function (event) {
            if (currentGroupName === groupName) {
                const needRemoveClass = event.fromElement && event.toElement
                    && event.fromElement.closest('.draggable-element') !== event.toElement.closest('.draggable-element');
                if (needRemoveClass) {
                    this.classList.remove('over');
                }
            }
        });
        element.addEventListener('dragover', function (event) {
            if (currentGroupName === groupName) {
                event.preventDefault();
            }
            return false;
        });
        element.addEventListener('drop', function (event) {
            event.stopPropagation();
            if (draggableElementIndex !== ordinalIndex) {
                const dragRowEvent = new CustomEvent('drag-row', {
                    detail: {
                        oldIndex: draggableElementIndex,
                        newIndex: ordinalIndex,
                    },
                });
                element.dispatchEvent(dragRowEvent);
            }

            this.classList.remove('over');
            return false;
        });
        element.addEventListener('dragend', function () {
            this.classList.remove('moving');
            this.removeAttribute('draggable');
        });
    },
};
