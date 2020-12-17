# Vue app
To create Vue app:
```shell
vue create vueapp
```

### TypeScript in Vue.js Development
TS isn’t required for Vue.js development, but Vue.js packages contain type declaration files, Vue Cli package can
create projects configured for TypeScript. \
`.vue` files don’t need to change the extension for TS. Files contain template, style, and script elements, known as
`single-file components`. Using TypeScript, you can choose to define Vue.js components using `classes` that are annotated
with decorators. You can see an example of how classes and decorators are used in Vue.js in the `Home.vue`
```vue
<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png">
    <HelloWorld msg="Welcome to Your Vue.js + TypeScript App"/>
  </div>
</template>

<script lang="ts">
  import { Options, Vue } from 'vue-class-component';
  import HelloWorld from '@/components/HelloWorld.vue'; // @ is an alias to /src

  @Options({
    components: {
      HelloWorld,
    },
  })
  export default class Home extends Vue {}
</script>
```
`<script lang="ts">` this value specifies TS and ensures that the code will be processed by the TS compiler. \
Some features, such as the `class syntax` for defining components, are available only when using TS. \
The alternative is to use the `object literal` syntax to define components in non-TypeScript projects. Both approaches
can be used in the same project.

#### TypeScript Vue.js Toolchain
The Vue.js development tools rely on `webpack` and the WDS packages, same as Angular and React.
When a project uses TS, a tsconfig.json file is created to configure the compiler with the following settings:

Vue converts `template` tag to code statements with **Vue.js development tools** \
`script` element - using the TS compiler. The compiled code is passed to the `Babel` package to make JS from TS \
TS files and TS JSX files are also supported, and the results are bundled into files that are served to the browser
through the WDS.

`.vue`, `.ts`, `.tsx` -> webpack work starts -> TS Compiler -> Babel -> JS bundle -> webpack work ends -> browser.

Supporting TS in a **Vue.js** project requires some adaptations, which is why you will see the `shims-tsx.d.ts` and
`shims-vue.d.ts` files in the project folder. These files provide type declarations that allow the TS compiler to 
resolve dependencies on TypeScript JSX and Vue single-file components. \
Vue doesn't work well with the types, so it's better to use `class` instead of `type`, also Vue.js change detection not
good with the JS `Map`, so better use `array`.

The convention is to store individual components in the `src/components` folder and compose them together for display
to the user using the `src/views` folder. \
Vue.js component’s template uses data bindings like `{{ and }}` \
To display data values and uses event handling attributes `<button @click="handleAddToCart">`, to handle events.
The bindings expressions and event attributes are evaluated using the featured defined by the class in the `script` element.

The combination of TS and decorators change the way that Vue.js components are defined. Allowing the use of components
that are defined as classes that extend Vue, to which the `@Component` decorator is applied.
The `@Prop` decorator denotes a property whose value will be supplied by the parent component, note property requires
the definite assignment assertion, which indicates that a value will be available, even though it is not visible to compiler.
```vue
<script>
@Component
export default class ProductItem extends Vue {
  @Prop() private product!: Product;
}
</script>
```

The element attributes in the `template` section are evaluated as string literal values unless they are prefixed with
`v-bind`, which tells Vue.js to create a data binding between the code in the `script` element, and the value assigned
to the attribute. This is an example of a **Vue.js directive**, and it allows the result of methods defined by the
component class to be inserted into the HTML in the template section.
```vue
<template>
  <div>
    <button v-for="c in categories"
            v-bind:key="c"
            v-bind:class="getButtonClasses(c)"
            @click="selectCategory(c)">
      {{ c }}
    </button>
  </div>
</template>
<script lang="ts">
import {Component, Prop} from "vue";
import {Vue} from 'vue-class-component';

@Component
export default class CategoryList extends Vue {
  @Prop()
  private categories!: string[];
  @Prop()
  private selected: string = this.categories[0];

  selectCategory(category: string) {
    this.$emit("selectCategory", category);
  }

  getButtonClasses(category: string): string {
    let btnClass = this.selected === category ? "btn-primary" : "btn-secondary";
    return `btn btn-block ${btnClass}`;
  }
}
</script>
```
`v-for` directive tells Vue.js to create a button element for each value in categories property. \

The `Header` element applies the `Header` component. Vue.js uses the `v-bind` directive to create a data binding that
sets the `Header` component’s `order` prop to the `order` property defined by the `ProductList` class, allowing one
component to provide data values to another.
```vue
<Header v-bind:order="order"/>
```

**Data** in most Vue.js projects is managed using the `Vuex` package, which provides data store features that are 
integrated into the Vue.js API.
```ts
import Vue from 'vue'
import Vuex from 'vuex'
import {Product, Order} from './data/entities';

Vue.use(Vuex)

export interface StoreState {
  products: Product[],
  order: Order,
  selectedCategory: string
}

type ProductSelection = {
  product: Product,
  quantity: number
}

export default new Vuex.Store<StoreState>({
  state: {
    products: [1, 2, 3, 4, 5].map(num => new Product(num, `Store Prod${num}`, `Product ${num}`, `Cat${num % 2}`, 450)),
    order: new Order(),
    selectedCategory: "All"
  },
  mutations: {
    selectCategory(currentState: StoreState, category: string) {
      currentState.selectedCategory = category;
    },
    addToOrder(currentState: StoreState, selection: ProductSelection) {
      currentState.order.addProduct(selection.product, selection.quantity);
    }
  },
  getters: {
    categories(state): string[] {
      return ["All", ...new Set(state.products.map(p => p.category))];
    },
    filteredProducts(state): Product[] {
      return state.products.filter(p => state.selectedCategory === "All" || state.selectedCategory === p.category);
    }
  },
  actions: {}
})
```
Vuex data stores are set up with three properties: `state`, `mutations`, and `actions`. \
`state` - used to set up the state data managed by the data store. \
`mutations` - define functions that modify the state data. \
`actions` - define asynchronous tasks that use mutations to update the store. \
Data stores can also define a `getters` property, used to compute data values from the data held in the store.

The project has been configured with declaration files for Vuex, which allows a data store to be created with a generic
type argument that describes the types of the state data, which TypeScript can then use to perform type checking.

The types in the `StoreState` interface are applied to the `state` section of the data store, as well as to the
`mutations` and `getters`, ensuring that only the properties specified by the interface are used and that they are
assigned only the expected types.

#### Creating Data Store Decorators
Vuex provides helper functions that are used to map data store features to components, but these are awkward to use
with the class-based component syntax. We can write decorators that do the same job and fit into the class-based approach.
```ts
import store, {StoreState} from "../store";

export function state<T extends keyof StoreState>(name: T) {
  return function (target: any, propKey: string): any {
    return {
      get: function () {
        return store.state[name];
      }
    }
  }
}

export function getter(name?: string) {
  return function (target: any, propKey: string): any {
    return {
      get: function () {
        return store.getters[name || propKey];
      }
    }
  }
}

export function mutation(name?: string) {
  return function (target: any, propKey: string, descriptor: PropertyDescriptor) {
    descriptor.value = function (...args: any) {
      store.commit(name || propKey, ...args);
    }
  }
}

export function action(name?: string) {
  return function (target: any, propKey: string, descriptor: PropertyDescriptor) {
    descriptor.value = function (...args: any) {
      store.dispatch(name || propKey, ...args);
    }
  }
}
```
The decorators connect a class member to the data store. The `state` and `getter` decorators are applied to properties
and transform them, so they return the result from a `state` property or `getter` function defined in the data store.
They work by replacing the definition of the property with a `getter` accessor that invokes the data store feature.
The `mutation` and `action` decorators replace the implementation of a method with a function that invokes a `mutation`
or an `action` defined by the data store.

#### Connecting Components to the Data Store
The decorators can be applied to class-based components to connect properties and methods to the data store,
allowing access to shared state without the need to pass prop values around. 
```vue
<script lang="ts">
@Component
export default class Header extends Vue {
  @state("order") /* Here you can see the decorator */
  order!: Order
}
</script>
```
The `state` decorator connects the `order` property defined by the `Header` class to the `order` state data property
in the data store.

Vue.js doesn’t include integrated support for HTTP requests. A popular choice for working with HTTP is
the Axios package, which I have used throughout this part of the book and which was added to the example
project in Listing 21-3. To define the HTTP operations that the example application requires, I added a file
called httpHandler.ts to the src/data folder and added the code shown in Listing 21-20.