# v-directive-draggable

Vue directive to drag and drop elements.

### <a href="https://codesandbox.io/s/v-directive-draggable-example-qh49z">Demo page</a>

### Installation

```shell
npm i v-directive-draggable
```

## Usage

```javascript
import Vue from 'vue'
import VueDraggable from 'v-directive-draggable'

Vue.use(VueDraggable)
```

```vue
<template>
  <div>
    <div
      v-for="(item, index) in dataSource"
      v-draggable="{ handleSelector: '.handle', groupName: 'unique_string', ordinalIndex: index }"
      :key="index"
      @drag-row="dragRow"
    >
      <div class="handle">*</div>
      <div>{{ item.name }}</div>
      <div>{{ item.weight }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataSource: [
        {
          name: "Orange",
          weight: 3,
        },
        {
          name: "Banana",
          weight: 7,
        },
        {
          name: "Apple",
          weight: 1,
        },
      ],
    };
  },
  methods: {
    dragRow(event) {
      console.log(event.detail);
      const { newIndex, oldIndex } = event.detail;
      const moveElements = this.dataSource.splice(oldIndex, 1);
      this.dataSource.splice(newIndex, 0, moveElements[0]);
    },
  },
};
</script>
```

### Definition

```javascript
import Vue from 'vue'
import VueDraggable from 'v-directive-draggable'

Vue.use(VueDraggable, {
  name: 'drag'
})

# or

import VueDraggable from 'v-directive-draggable'

export default {
  directives: {
    drag: draggable,
  },
};
```

## Options

| Property | Type | Description |
|-|:-:|-|
|handleSelector|string|the name of the block selector with which the drag will be performed|
|groupName|string|the name of a group of elements within which dragging is possible|
|ordinalIndex|number|index of the dragged row that will be passed as information when events are triggered|

---

## Default Event Handler

- dragstart (as default)
- dragenter (as default)
- dragleave (as default)
- drop (as default)
- dragend (as default)

## Event Handler

- drag-row

### drag-row

The function to be called by any relevant container when drop is over.
```js
function dragRow(event) {
  const { newIndex, oldIndex } = event.detail;
  ...
}
```
#### Parameters
- **event** : `object`
  - **detail** : `object` 
    - **oldIndex** : `number` : index of the dragged row.
    - **newIndex** : `number` : the index of the line to which the drag occurred (the new index of the line being dragged).

## CSS selectors

| Name | Selector Type | Description |
|-|:-:|-|
|draggable|Attribute|Draggable item selected with mouse|
|draggable-element|Class|Elements on which directives hang|
|moving|Class|The element being dragged|
|over|Class|The element over which the dragged element is located|

---
