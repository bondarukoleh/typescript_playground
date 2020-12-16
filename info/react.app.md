# Creating a React App
Some new compiler options:

|name|description|
|:---|:---|
|`allowSyntheticDefaultImports`|allows imports from modules that do not declare a default export. This option is used to increase code compatibility.|
|`esModuleInterop`|adds helper code for importing from modules that do not declare a default export and is used with `allowSyntheticDefaultImports`|
|`forceConsistentCasingInFileNames`|ensures that names in `import` statements match the case used by the imported file|
|`isolatedModules`|treats each file as a separate module, which increases compatibility with the Babel tool|
|`resolveJsonModule`|allows JSON files to be imported as though they were modules|
|`skipLibCheck`|speeds up compilation by skipping the normal checking of declaration files|
|`strict`|enables stricter checking of TypeScript code|

To create app with TS
```shell
create-react-app reactapp --typescript
```

### Understanding TypeScript in React Development
TS is optional in React, and this is reflected in the way TS compiler are configured. \
React uses `JSX`, to make `.js` from `.jsx` react uses `Babel`.  Babel is a JS compiler that allows to transpile ES2020 to
ES5. Babel is extensible through plugins, and support translation a wide range of other formats into JS. \
Behind the scenes react uses `webpack` as a bundler, to do 1 file from all JS code and deliver it to the browser. \

TSX -> webpack work starts -> TS Compiler (checks types) -> Babel (jsx from tsx) -> JS code -> JS bundle -> webpack work ends -> Browser;

You can see that in some versions `create-react-app --typescript` creates `tsconfig.json` with such setting like 
`"noEmit": true, "jsx": "preserve"` which means that TS Compiler will emit? the `.jsx` from `.tsx` but that's it, it
will leave transpile `.tsx` into `.jsx` to `Babel`. The React toolchain includes a `Babel plugin` that transforms TS
into pure JS and is also able to deal with the HTML elements in `JSX/TSX` files.
**Babel** is able to transform TS into JS, but it **doesn’t understand the TypeScript** features, and it doesn’t know
how to perform type checking. So TS compiler detect type errors, and Babel is creating the JS code the browser will execute.

React focuses on presenting HTML content and leaves tasks like managing application data or HTTP requests to other packages.

The `ProductItem` component has one `state` property, named `quantity`. The `props` and `state` are described by the
`Props` and `State` interfaces, which are used as generic type parameters to configure the base class for components.

The `generic` type arguments allow the TS compiler to check the component when it is applied so that only properties
defined by the `Props` interface are used and to ensure that updates are applied only to properties defined by the `State`
interface. Change for `select` element, handler function will receive a `ChangeEvent<HTMLSelectElement>` object.
The TypeScript compiler will ensure that the right **type of event** is handled and that updates through the `setState`
method are of the right `type` and update only the `properties` defined by the `State` type.

```tsx
import React, {Component, ChangeEvent} from "react";
interface Props { product: Product,  callback: (product: Product, quantity: number) => void }
interface State { quantity: number }

export class ProductItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      quantity: 1
    }
  }

  render() {
    return <div className="card m-1 p-1 bg-light">
      <h4>
        {this.props.product.name}
        <span className="badge badge-pill badge-primary float-right"> 
         ${this.props.product.price.toFixed(2)}
        </span>
      </h4>
      <div className="card-text bg-white p-1">
        <button className="btn btn-success btn-sm float-right"
                onClick={this.handleAddToCart}>
          Add To Cart
        </button>
       <select className="form-control-inline float-right m-1"
               onChange={this.handleQuantityChange}>
        <option>1</option>
        <option>2</option>
        <option>3</option>
       </select>
      </div>
    </div>
  }

 handleQuantityChange = (ev: ChangeEvent<HTMLSelectElement>): void => this.setState({quantity: Number(ev.target.value)});
  handleAddToCart = (): void => this.props.callback(this.props.product, this.state.quantity);
}
```

### Using a Functional Component and Hooks
TS functional components are annotated with the `FunctionComponent<T>` type, where the generic type `T` describes the
`props` the component will receive. 
```tsx
import React, {FunctionComponent, useState} from "react";
interface Props { product: Product, callback: (product: Product, quantity: number) => void }

export const ProductItem: FunctionComponent<Props> = (props) => {
 const [quantity, setQuantity] = useState<number>(1);
 return <div className="card m-1 p-1 bg-light">
  <h4>
      {props.product.name}
      <span className="badge badge-pill badge-primary float-right">
      ${props.product.price.toFixed(2)}
    </span>
  </h4>
  <div className="card-text bg-white p-1">
   {props.product.description}
   <button className="btn btn-success btn-sm float-right"
           onClick={() => props.callback(props.product, quantity)}>
    Add To Cart
   </button>
   <select className="form-control-inline float-right m-1"
           onChange={(ev: ChangeEvent<HTMLSelectElement>) => setQuantity(Number(ev.target.value))}>
    <option>1</option>
    <option>2</option>
    <option>3</option>
   </select>
  </div>
 </div>
}
```

### Creating the Data Store
To add redux:
```shell
npm install redux react-redux @types/react-redux
```
The Redux package includes TS declarations, but an additional package is required for the React-Redux package, which
connects React components to a data store.

```typescript
import {Product, Order} from "./entities";
import {Action} from "redux";

export interface StoreData {
  products: Product[],
  order: Order
}
export enum ACTIONS {
  ADD_PRODUCTS, MODIFY_ORDER, RESET_ORDER
}
export interface AddProductsAction extends Action<ACTIONS.ADD_PRODUCTS> {
  payload: Product[]
}
export interface ModifyOrderAction extends Action<ACTIONS.MODIFY_ORDER> {
  payload: {
    product: Product,
    quantity: number
  }
}
export interface ResetOrderAction extends Action<ACTIONS.RESET_ORDER> {
}
export type StoreAction = AddProductsAction | ModifyOrderAction | ResetOrderAction;
```
The `StoreData` interface describes the data that the data store will manage. \
The `ACTIONS` enum defines a set of values, each of which corresponds to an action that the data store will support. \
Each enum value is used as a type argument to the `Action` type, which is an interface provided by the Redux package.
The `Action` interface is extended to describe the characteristics of the object for each action type, some of which
have a payload property that provides the data that will be required to apply the action. \
The `StoreAction` type is the intersection of the action interfaces.

```typescript
import {Reducer} from "redux";
export const StoreReducer: Reducer<StoreData, StoreAction> = (data: StoreData | undefined, action) => {
  data = data || {products: [], order: new Order()}
  switch (action.type) {
    case ACTIONS.ADD_PRODUCTS:
      return {
        ...data,
        products: [...data.products, ...action.payload]
      };
    case ACTIONS.MODIFY_ORDER:
      //...
  }
}
```
A reducer function receives the data currently in the `data` and an `action` and returns the modified data. \
`Reducer<S, A>` - where `S` is shape of the store and `A` is the type that represents the actions the store supports. 

Root reducer:
```typescript
import { createStore, Store } from "redux";
import { StoreReducer } from "./reducer";
import { StoreData, StoreAction } from "./types";
export const dataStore: Store<StoreData, StoreAction> = createStore(StoreReducer);
```

#### Configuring URL Routing
React doesn’t include built-in support for URL routing, but the most commonly used package is React Router.
```shell
npm install react-router-dom @types/react-router-dom
```