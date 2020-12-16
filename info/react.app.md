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