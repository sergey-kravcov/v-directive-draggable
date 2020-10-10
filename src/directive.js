import $ from 'jquery';

let draggableElementIndex;

export default {
    bind: (element, binding) => {
        const { handleSelector = '', index = -1 } = binding.value || {};

        if (index === -1) {
            return;
        }
        const sourceElement = $(element);
        let handleElement = sourceElement;
        if (handleSelector) {
            const handles = sourceElement.find(handleSelector);
            if (!handles.length) {
                return;
            }
            handleElement = $(handles[0]);
        }

        sourceElement.addClass('draggable-element');

        handleElement
			.on('mousedown', function () {
				element.setAttribute('draggable', 'true');
			})
			.on('mouseup', function () {
				sourceElement.removeAttr('draggable');
			});

        sourceElement
            .on('dragstart', function (event) {
                $(this).addClass('moving');
                draggableElementIndex = index;
            })
            .on('dragenter', function () {
                $(this).addClass('over');
            })
            .on('dragleave', function () {
                $(this).removeClass('over');
            })
			.on('dragover', (event) => {
				event.preventDefault();
				return false;
			})
            .on('drop', (event) => {
                event.stopPropagation();
                if (draggableElementIndex !== index) {
                    const dragRowEvent = new CustomEvent('dragRow', {
                        detail: {
                            oldIndex: draggableElementIndex,
                            newIndex: index,
                        },
                    });
                    element.dispatchEvent(dragRowEvent);
                }

                return false;
            })
            .on('dragend', function () {
                const rows = this.parentElement.querySelectorAll('.draggable-element');
                [].forEach.call(rows, (row) => {
                    const element = $(row);
                    element.removeClass('over');
                    element.removeClass('moving');
                });
            });
    },
};
